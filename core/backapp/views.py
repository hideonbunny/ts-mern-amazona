from django.shortcuts import render
# from django.http import HttpResponse, JsonResponse
# from .products import products
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializer import OrderItemSerializer, OrderSerializer, ProductSerializer, UserSerializer, UserSerializerWithToken, MarkOrderAsPaidResponseSerializer
from .models import Order, OrderItem, Products, ShippingAddress
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
import stripe
from django.utils import timezone
# Create your views here.


# def home(request):
#     return render(request, 'home.html')

# def about(request):
#     return render(request, 'about.html')

@api_view(['GET'])
def getRoutes(request):
    return Response("Hello, world!")


@api_view(['GET'])
def getProducts(request):
    products = Products.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getProduct(request, slug):
    product = Products.objects.get(slug=slug)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            print(k, v)
            data[k] = v

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
def getUserProfiles(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def signup(request):
    data = request.data
    # print(data)
    try:

        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password'])
        )
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except:
        message = {'details': 'USER WITH THIS EMAIL ALREADY EXIST'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    if not request.data.get('orderItems'):
        return Response({'message': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

    data = request.data

    try:
        # First, create the Order object
        shipping_address_data = data['shippingAddress']
        shipping_address = ShippingAddress.objects.create(
            fullname=shipping_address_data['fullname'],
            address=shipping_address_data['address'],
            city=shipping_address_data['city'],
            country=shipping_address_data['country'],
            postalCode=shipping_address_data['postalCode']
        )
        order = Order.objects.create(
            user=request.user,
            shippingAddress=shipping_address,
            paymentMethod=data['paymentMethod'],
            itemPrice=data['itemsPrice'],
            shippingPrice=data['shippingPrice'],
            taxPrice=data['taxPrice'],
            totalPrice=data['totalPrice'],
        )

        # Next, create each OrderItem and associate it with the Order
        for item_data in data['orderItems']:
            print(item_data)
            item_data.pop('_id', None)
            OrderItem.objects.create(order=order, **item_data)

        serializer = OrderSerializer(order)
        return Response({'message': 'Order created successfully', 'order': serializer.data}, status=status.HTTP_201_CREATED)
    except Exception as e:
        message = {'details': 'Something went wrong', 'error': str(e)}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrdersHistory(request):
    user = request.user
    orders = Order.objects.filter(user=user)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getOrder(request, id):
    order = Order.objects.get(_id=id)
    serializer = OrderSerializer(order)
    return Response(serializer.data)


stripe.api_key = settings.STRIPE_SECRET_KEY


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment(request):
    order_id = request.data.get('orderId')
    if not order_id:
        return Response({'error': 'Order ID is required'}, status=400)

    try:
        order = Order.objects.get(
            _id=order_id, user=request.user, isPaid=False)
        amount = int(order.totalPrice * 100)
        # Stripe expects amount in cents

        payment_intent = stripe.PaymentIntent.create(
            amount=amount,
            currency='usd',
            description=f"Payment for Order {order._id}",
        )

        return Response({'clientSecret': payment_intent.client_secret})

    except Order.DoesNotExist:
        return Response({'error': 'Order does not exist'}, status=404)
    except Exception as e:
        return Response({'error': str(e)})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_order_as_paid(request):
    order_id = request.data.get('orderId')
    if not order_id:
        return Response({'error': 'Order ID is required'}, status=400)

    try:
        order = Order.objects.get(
            _id=order_id, user=request.user, isPaid=False)

        # Create a payment intent with Stripe here if needed

        # Mark the order as paid
        order.isPaid = True
        order.paidAt = timezone.now()
        order.save()

        # Serialize the response data
        response_data = {
            'message': 'Order has been successfully marked as paid'}
        serializer = MarkOrderAsPaidResponseSerializer(data=response_data)

        if serializer.is_valid():
            return Response(serializer.validated_data)
        else:
            return Response(serializer.errors, status=400)

    except Order.DoesNotExist:
        return Response({'error': 'Order does not exist'}, status=404)
    except Exception as e:
        return Response({'error': str(e)})
