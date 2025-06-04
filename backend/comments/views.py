from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from .models import Comment
from blog.models import BlogPost
from .serializers import CommentSerializer

class CommentListView(APIView):
    """
    API View for handling blog post comments.
    Supports listing comments for a post and creating new comments.
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        """
        Get all comments for a specific blog post.
        Requires post_id as a query parameter.
        """
        post_id = request.query_params.get('post_id')
        if not post_id:
            return Response(
                {'error': 'post_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get comments for the specified post
        post = get_object_or_404(BlogPost, id=post_id)
        comments = Comment.objects.filter(post=post)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request):
        """
        Create a new comment for a blog post.
        Requires authentication.
        """
        serializer = CommentSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            # Create the comment with the current user as author
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CommentDetailView(APIView):
    """
    API View for managing individual comments.
    Supports retrieving, updating and deleting a specific comment.
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, pk):
        """
        Retrieve a specific comment.
        """
        comment = get_object_or_404(Comment, pk=pk)
        serializer = CommentSerializer(comment)
        return Response(serializer.data)

    def get_comment(self, pk):
        """
        Helper method to get a comment instance.
        Returns 404 if not found.
        """
        return get_object_or_404(Comment, pk=pk)

    def put(self, request, pk):
        """
        Update a specific comment.
        Only the comment author can update their comment.
        """
        comment = get_object_or_404(Comment, pk=pk)
        # Check if user is the author of the comment
        if comment.author != request.user:
            return Response(
                {'error': 'You can only edit your own comments'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = CommentSerializer(
            comment,
            data={'content': request.data.get('content')},
            partial=True,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk):
        """
        Delete a specific comment.
        Only the comment author or the post author can delete the comment.
        """
        comment = get_object_or_404(Comment, pk=pk)
        # Check if user is either the comment author or the post author
        if comment.author != request.user and comment.post.author != request.user:
            return Response(
                {'error': 'You can only delete your own comments or comments on your posts'},
                status=status.HTTP_403_FORBIDDEN
            )
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)