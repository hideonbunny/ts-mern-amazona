from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import Order, OrderItem, Products, ShippingAddress, User
from rest_framework_simplejwt.tokens import RefreshToken


class ProductSerializer(ModelSerializer):
    class Meta:
        model = Products
        fields = '__all__'


class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'email']


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name',  'email', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


class ShippingAddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = ShippingAddress
        fields = '__all__'  # and any other fields you want to include


class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)
    shippingAddress = ShippingAddressSerializer()

    class Meta:
        model = Order
        fields = [
            '_id', 'shippingAddress', 'user', 'paymentMethod', 'paymentResult',
            'itemPrice', 'shippingPrice', 'taxPrice', 'totalPrice', 'isPaid',
            'paidAt', 'isDelivered', 'deliveredAt', 'createdAt', 'order_items'
        ]


class MarkOrderAsPaidResponseSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=255)
