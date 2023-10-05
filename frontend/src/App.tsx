import { useContext, useEffect } from "react";
import {
  Navbar,
  Container,
  Nav,
  Button,
  Badge,
  NavDropdown,
} from "react-bootstrap";

import { LinkContainer } from "react-router-bootstrap";
import { Link, Outlet } from "react-router-dom";
import { Store } from "./Store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGetProductsQuery } from "./hooks/productHooks";

function App() {
  const {
    state: { mode, cart, userInfo },
    dispatch,
  } = useContext(Store);

  useEffect(() => {
    document.body.setAttribute("data-bs-theme", mode);
  }, [mode]);

  const switchModeHandler = () => {
    dispatch({ type: "SWITCH_MODE" });
  };

  const signoutHandler = () => {
    dispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };

  const { data: products, isLoading } = useGetProductsQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }
  const categorylist: Array<string> = products!.reduce(
    (a: Array<string>, c) => {
      if (!a.includes(c.category)) {
        a.push(c.category);
      }
      return a;
    },
    []
  );

  return (
    <div className="d-flex flex-column vh-100">
      <ToastContainer position="bottom-center" limit={1} />
      <header>
        <Navbar expand="lg">
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand>tsamazona</Navbar.Brand>
            </LinkContainer>
          </Container>
          <Nav>
            <NavDropdown
              title="Shop by category"
              id="basic-nav-dropdown"
              className="dropdown-menu-start"
            >
              {categorylist.map((category) => (
                <LinkContainer to={`/category/${category}`} key={category}>
                  <NavDropdown.Item>{`${category}`}</NavDropdown.Item>
                </LinkContainer>
              ))}
            </NavDropdown>

            <Button variant={mode} onClick={switchModeHandler}>
              <i className={mode === "light" ? "fa fa-sun" : "fa fa-moon"}></i>
            </Button>
            <Link to="/cart" className="nav-link">
              Cart
              {cart.cartItems.length > 0 && (
                <Badge pill bg="danger">
                  {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                </Badge>
              )}
            </Link>
            {userInfo ? (
              <NavDropdown
                title={userInfo.first_name}
                id="basic-nav-dropdown"
                className="dropdown-menu-start"
              >
                <LinkContainer to="/orderhistory">
                  <NavDropdown.Item>Order History</NavDropdown.Item>
                </LinkContainer>
                <Link
                  className="dropdown-item"
                  to="#signout"
                  onClick={signoutHandler}
                >
                  Sign Out
                </Link>
              </NavDropdown>
            ) : (
              <Link className="nav-link" to="/signin">
                Sign In
              </Link>
            )}
          </Nav>
        </Navbar>
      </header>
      <main>
        <Container className="mt-3">
          <Outlet />
        </Container>
      </main>
      <footer className="text-center">All right reserved</footer>
    </div>
  );
}

export default App;
