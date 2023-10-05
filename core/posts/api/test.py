from rest_framework.viewsets import ModelViewSet
from ..models import Post
from .serializers import BunnySerializer, PostSerializer


class Bunny(ModelViewSet):
    serializer_class = BunnySerializer
    queryset = Post.objects.all()
