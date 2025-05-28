from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from .models import BlogPost

User = get_user_model()

class BlogAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!'
        )
        self.other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='OtherPass123!'
        )

        self.test_post = BlogPost.objects.create(
            title='Test Post',
            content='Test Content',
            summary='Test Summary',
            author=self.user,
            tags=['test', 'api']
        )

        self.list_url = reverse('blog-list')
        self.detail_url = reverse('blog-detail', kwargs={'pk': self.test_post.pk})
        self.user_posts_url = reverse('user-posts', kwargs={'username': self.user.username})

    def authenticate_user(self, user):
        self.client.force_authenticate(user=user)

    def test_list_blog_posts(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Test Post')

    def test_create_blog_post_authenticated(self):
        self.authenticate_user(self.user)
        data = {
            'title': 'New Post',
            'content': 'New Content',
            'summary': 'New Summary',
            'tags': ['new', 'post']
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(BlogPost.objects.count(), 2)
        self.assertEqual(response.data['title'], 'New Post')
        self.assertEqual(response.data['author'], self.user.username)

    def test_create_blog_post_unauthenticated(self):
        data = {
            'title': 'Unauthorized Post',
            'content': 'Content',
            'summary': 'Summary'
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_blog_post(self):
        """get a specific blog post by ID"""
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Post')

    def test_update_own_blog_post(self):
        self.authenticate_user(self.user)
        data = {
            'title': 'Updated Post',
            'content': 'Updated Content',
            'summary': 'Updated Summary',
            'tags': ['updated']
        }
        response = self.client.put(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Post')

    def test_update_others_blog_post(self):
        """test updating a blog post that belongs to another user (should fail)"""
        self.authenticate_user(self.other_user)
        data = {
            'title': 'Unauthorized Update',
            'content': 'Content',
            'summary': 'Summary'
        }
        response = self.client.put(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_own_blog_post(self):
        """test deleting a blog post that belongs to the authenticated user"""
        self.authenticate_user(self.user)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(BlogPost.objects.count(), 0)

    def test_delete_others_blog_post(self):
        """test deleting a blog post that belongs to another user (should fail)"""
        self.authenticate_user(self.other_user)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(BlogPost.objects.count(), 1)

    def test_list_user_blog_posts(self):
        """test listing all blog posts by a specific user"""
        response = self.client.get(self.user_posts_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['author'], self.user.username)

    # TODO uncomment and implement filtering by tags after changing DB to AWS PostgreSQL
    # def test_blog_post_tags_filter(self):
    #     """test filtering blog posts by tags"""
    #     BlogPost.objects.create(
    #         title='Another Post',
    #         content='Content',
    #         summary='Summary',
    #         author=self.user,
    #         tags=['other']
    #     )
        
    #     response = self.client.get(f'{self.list_url}?tags=test')
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(len(response.data), 1)
    #     self.assertEqual(response.data[0]['title'], 'Test Post')

    def test_create_blog_post_invalid_data(self):
        """test creating a blog post with invalid data"""
        self.authenticate_user(self.user)
 
        data = {
            'title': '',
            'content': 'Content',
            'summary': 'Summary'
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('title', response.data)

    def test_update_blog_post_invalid_data(self):
        """test updating a blog post with invalid data"""
        self.authenticate_user(self.user)
        data = {
            'title': '', 
            'content': 'Updated Content'
        }
        response = self.client.put(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('title', response.data)
