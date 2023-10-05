from django.contrib import admin
from backapp.models import *
# Register your models here.

admin.site.register(Products)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
admin.site.register(PaymentResult)
