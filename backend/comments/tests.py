from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from blog.models import BlogPost
from .models import Comment

User = get_user_model()

class CommentViewTests(TestCase):
    def setUp(self):
        """
        Set up test data:
        - Two users (author and commenter)
        - One blog post
        - One comment
        """
        # Create test users
        self.user1 = User.objects.create_user(
            username='author',
            email='author@test.com',
            password='testpass123'
        )
        self.user2 = User.objects.create_user(
            username='commenter',
            email='commenter@test.com',
            password='testpass123'
        )

        # Create a blog post
        self.blog_post = BlogPost.objects.create(
            title='Test Post',
            content='Test content',
            author=self.user1,
            summary='Test summary'
        )

        # Create a comment
        self.comment = Comment.objects.create(
            post=self.blog_post,
            author=self.user2,
            content='Test comment'
        )

        # Initialize the API client
        self.client = APIClient()

    def test_get_comments_for_post(self):
        """
        Test retrieving comments for a specific post
        """
        response = self.client.get(f'/comments/?post_id={self.blog_post.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['content'], 'Test comment')

    def test_get_comments_without_post_id(self):
        """
        Test that requesting comments without post_id returns an error
        """
        response = self.client.get('/comments/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_comment_authenticated(self):
        """
        Test creating a comment as an authenticated user
        """
        self.client.force_authenticate(user=self.user2)
        data = {
            'post_id': self.blog_post.id,
            'content': 'New comment'
        }
        response = self.client.post('/comments/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 2)
        self.assertEqual(response.data['content'], 'New comment')

    def test_create_comment_unauthenticated(self):
        """
        Test that unauthenticated users cannot create comments
        """
        data = {
            'post_id': self.blog_post.id,
            'content': 'New comment'
        }
        response = self.client.post('/comments/', data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_own_comment(self):
        """
        Test updating own comment
        """
        self.client.force_authenticate(user=self.user2)
        data = {'content': 'Updated comment'}
        response = self.client.put(
            f'/comments/{self.comment.id}/',
            data
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['content'], 'Updated comment')

    def test_update_others_comment(self):
        """
        Test that users cannot update others' comments
        """
        self.client.force_authenticate(user=self.user1)
        data = {'content': 'Updated comment'}
        response = self.client.put(
            f'/comments/{self.comment.id}/',
            data
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_own_comment(self):
        """
        Test deleting own comment
        """
        self.client.force_authenticate(user=self.user2)
        response = self.client.delete(f'/comments/{self.comment.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Comment.objects.count(), 0)

    def test_post_author_can_delete_comment(self):
        """
        Test that post author can delete any comment on their post
        """
        self.client.force_authenticate(user=self.user1)  # Post author
        response = self.client.delete(f'/comments/{self.comment.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Comment.objects.count(), 0)

    def test_other_user_cannot_delete_comment(self):
        """
        Test that other users cannot delete comments
        """
        other_user = User.objects.create_user(
            username='other',
            email='other@test.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=other_user)
        response = self.client.delete(f'/comments/{self.comment.id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Comment.objects.count(), 1)
