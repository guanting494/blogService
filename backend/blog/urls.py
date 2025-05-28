from django.urls import path
from .views import (
    BlogPostListView,
    BlogPostDetailView,
    UserBlogPostsView
)

urlpatterns = [
    path('posts/', BlogPostListView.as_view(), name='blog-list'),
    path('posts/<int:pk>/', BlogPostDetailView.as_view(), name='blog-detail'),
    # allows users to view all posts by a specific user
    path('user/<str:username>/posts/', UserBlogPostsView.as_view(), name='user-posts'),
]