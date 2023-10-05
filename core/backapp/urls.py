
from django.urls import include, path
from backapp import views
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,

)


urlpatterns = [
    # path('', views.home, name='home'),
    # path('about', views.about, name='about'),
    path('', views.getRoutes, name="getRoutes"),
    path('products/', views.getProducts, name="getProducts"),
    path('products/<str:slug>/', views.getProduct, name="getProduct"),
    path('users/signup/', views.signup, name="signup"),
    path('users/signin/', MyTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('user/profile/', views.getUserProfiles, name="getUserProfiles"),
    path('orders/mine/', views.getOrdersHistory, name='user-orders'),
    path('orders/', views.create_order, name='create_order'),
    path('orders/<str:id>/', views.getOrder, name='get-order'),
    path('create-payment/', views.create_payment, name='create-payment'),
    path('mark-order-as-paid/', views.mark_order_as_paid,
         name='mark-order-as-paid'),
]
