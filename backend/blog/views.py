from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import permissions
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404
from .models import BlogPost
from .serializers import BlogPostSerializer

class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow authors of a blog post to edit it.
    allows read-only access to unauthenticated users.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user

class BlogPostListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        posts = BlogPost.objects.all().order_by('-published_date')
        tags = request.query_params.get('tags')
        # TODO: Implement filtering by tags after change DB to AWS PostgreSQL
        # if tags:
        #     tag_list = tags.split(',')
        #     posts = posts.filter(tags__contains=tag_list)
            
        serializer = BlogPostSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BlogPostSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class BlogPostDetailView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    def get_object(self, pk):
        return get_object_or_404(BlogPost, pk=pk)

    def get(self, request, pk):
        post = self.get_object(pk)
        serializer = BlogPostSerializer(post)
        return Response(serializer.data)

    def put(self, request, pk):
        post = self.get_object(pk)
        self.check_object_permissions(request, post)
        
        serializer = BlogPostSerializer(post, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        post = self.get_object(pk)
        self.check_object_permissions(request, post)
        
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserBlogPostsView(APIView):
    def get(self, request, username):
        posts = BlogPost.objects.filter(author__username=username).order_by('-published_date')
        serializer = BlogPostSerializer(posts, many=True)
        return Response(serializer.data)