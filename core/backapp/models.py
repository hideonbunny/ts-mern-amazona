from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Products(models.Model):
    # user=models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    slug = models.CharField(
        max_length=200, blank=True)
    category = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(null=True, blank=True)
    price = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    countInStock = models.IntegerField(null=True, blank=True, default=0)
    brand = models.CharField(max_length=200, null=True, blank=True)
    rating = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    description = models.TextField(null=True, blank=True)
    # createdAt=models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return self.slug


class ShippingAddress(models.Model):
    # order=models.OneToOneField(Order,on_delete=models.CASCADE,null=True,blank=True)
    fullname = models.CharField(max_length=200, null=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)
    postalCode = models.CharField(max_length=200, null=True, blank=True)
    # shippingPrice=models.DecimalField(max_digits=7,decimal_places=2,null=True,blank=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return self.address


class PaymentResult(models.Model):
    paymentId = models.CharField(
        primary_key=True, max_length=200, null=False, blank=True)
    status = models.CharField(max_length=200, null=True, blank=True)
    update_time = models.CharField(max_length=200, null=True, blank=True)
    email_address = models.CharField(max_length=200, null=True, blank=True)


class Order(models.Model):
    # user=models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    _id = models.AutoField(primary_key=True, editable=False)

    shippingAddress = models.ForeignKey(
        ShippingAddress, on_delete=models.SET_NULL, null=True)

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    paymentMethod = models.CharField(max_length=200, null=True, blank=True)

    paymentResult = models.ForeignKey(
        PaymentResult, on_delete=models.SET_NULL, null=True, blank=True)

    itemPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)

    shippingPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)

    taxPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)

    totalPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)

    isPaid = models.BooleanField(default=False)

    paidAt = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    isDelivered = models.BooleanField(default=False)

    deliveredAt = models.DateTimeField(
        auto_now_add=False, null=True, blank=True)

    createdAt = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return str(self.paidAt)


class OrderItem(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True)
    quantity = models.IntegerField(null=True, blank=True, default=0)
    image = models.CharField(max_length=200, null=True, blank=True)
    price = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    product = models.ForeignKey(Products, on_delete=models.SET_NULL, null=True)
    order = models.ForeignKey(
        Order, related_name='order_items', on_delete=models.SET_NULL, null=True)
    _id = models.AutoField(primary_key=True, editable=False)
    slug = models.CharField(
        max_length=200, blank=True)
    countInStock = models.IntegerField(null=True, blank=True, default=0)

    def __str__(self):
        return self.name
