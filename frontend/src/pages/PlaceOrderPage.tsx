import { useContext, useEffect } from "react";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CheckoutSteps from "../components/CheckoutSteps";
import LoadingBox from "../components/LoadingBox";
import { useCreateOrderMutation } from "../hooks/orderHooks";
import { Store } from "../Store";
import { ApiError } from "../types/ApiError";
import { getError } from "../utils";
import { useFetchClientSecret, useFetchPayment } from "../hooks/paymentHooks";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import apiClient from "../apiClient";

export default function PlaceOrderPage() {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const cardElement = elements?.getElement(CardElement);
  const fetchClientSecretMutation = useFetchClientSecret();
  const fetchPaymentMutation = useFetchPayment();

  const { state, dispatch } = useContext(Store);
  //const { cart, userInfo } = state;
  const { cart } = state;

  const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23

  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const { mutateAsync: createOrder, isLoading } = useCreateOrderMutation();

  const placeOrderHandler = async () => {
    try {
      // Step 1: Create the order
      const orderResponse = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      });

      // Check if orderResponse was successful and contains the expected data
      if (orderResponse && orderResponse.order && orderResponse.order._id) {
        // Step 2: Fetch the client secret using the created order's ID
        const clientSecretResponse =
          await fetchClientSecretMutation.mutateAsync(orderResponse.order._id);

        const clientSecretFromBackend = clientSecretResponse.clientSecret;

        if (!stripe || !cardElement) {
          return;
        }

        // Step 3: Process the payment
        const result = await stripe.confirmCardPayment(
          clientSecretFromBackend,
          {
            payment_method: {
              card: cardElement,
            },
          }
        );

        if (result.error) {
          console.log("errorrrrrrrr!!!");
          toast.error(result.error.message);
        } else {
          if (result.paymentIntent.status === "succeeded") {
            const paymentResponse = await fetchPaymentMutation.mutateAsync(
              orderResponse.order._id
            );

            if (
              paymentResponse.message ===
              "Order has been successfully marked as paid"
            ) {
              dispatch({ type: "CART_CLEAR" });
              localStorage.removeItem("cartItems");
              navigate(`/order/${orderResponse.order._id}`);
            } else {
              console.error("Failed to mark the order as paid");
            }
          } else {
            // Handle error from order creation here
            console.log("Error creating order");
          }
        }
      }
    } catch (err) {
      toast.error(getError(err as ApiError));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h1 className="my-3">Preview Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {cart.shippingAddress.fullname} <br />
                <strong>Address: </strong> {cart.shippingAddress.address},
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                {cart.shippingAddress.country}
              </Card.Text>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {cart.paymentMethod}
              </Card.Text>
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded thumbnail"
                        ></img>{" "}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${cart.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${cart.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${cart.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      <strong>${cart.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <CardElement
                      options={{ style: { base: { fontSize: "16px" } } }}
                    />
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0 || isLoading}
                    >
                      Place Order
                    </Button>
                    {isLoading && <LoadingBox></LoadingBox>}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
