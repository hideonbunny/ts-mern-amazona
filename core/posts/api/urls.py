from django.urls import path
from rest_framework.routers import DefaultRouter

from .test import Bunny
from .views import PostViewSet

post_router = DefaultRouter()
post_router.register(r"posts", PostViewSet)
post_router.register(r"bunny", Bunny)
