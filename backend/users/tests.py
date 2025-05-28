from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from allauth.account.models import EmailAddress

User = get_user_model()

class AuthAPITestCase(APITestCase):
    def setUp(self):
        self.test_username = 'testuser123'
        self.test_email = 'test123@example.com'
        self.test_password = 'StrongPassword!123'

        self.user = User.objects.create_user(
            username=self.test_username,
            email=self.test_email,
            password=self.test_password
        )
        self.signup_url = reverse('rest_register') 
        self.login_url = reverse('rest_login')     
        self.logout_url = reverse('rest_logout')   


    def test_user_registration_success(self):
        new_username = 'newtestuser'
        new_email = 'newtest@example.com'
        data = {
            'username': new_username,
            'email': new_email,
            'password1': 'NewStrongPassword!456',
            'password2': 'NewStrongPassword!456'
        }

        response = self.client.post(self.signup_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('key', response.data)
        self.assertTrue(User.objects.filter(username=new_username).exists())
        self.assertTrue(EmailAddress.objects.filter(email=new_email, user__username=new_username).exists())

    def test_user_registration_fail_username_exists(self):
        data = {
            'username': self.test_username,
            'email': 'another@example.com',
            'password1': 'NewStrongPassword!456',
            'password2': 'NewStrongPassword!456'
        }

        response = self.client.post(self.signup_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)
        self.assertIn('A user with that username already exists.', response.data['username'])

    def test_user_registration_fail_password_mismatch(self):
        data = {
            'username': 'mismatchuser',
            'email': 'mismatch@example.com',
            'password1': 'Password494',
            'password2': 'PasswordABC'
        }
        response = self.client.post(self.signup_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('non_field_errors', response.data)
        self.assertIn('The two password fields didn\'t match.', response.data['non_field_errors'])

    def test_user_registration_fail_weak_password(self):
        data = {
            'username': 'weakpassuser',
            'email': 'weakpass@example.com',
            'password1': '123',
            'password2': '123'
        }
        response = self.client.post(self.signup_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password1', response.data)
        self.assertIn('This password is too short.', response.data['password1'][0])

    # User Login
    # CSRF token is skipped for API login

    def test_user_login_success_username(self):
        data = {
            'username': self.test_username,
            'password': self.test_password
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('key', response.data)

    def test_user_login_fail_incorrect_password(self):
        data = {
            'username': self.test_username,
            'password': 'WrongPassword!123'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('non_field_errors', response.data)
        self.assertIn('Unable to log in with provided credentials.', response.data['non_field_errors'])

    def test_user_login_fail_username_not_found(self):
        data = {
            'username': 'nonexistentuser',
            'password': 'AnyPassword!123'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('non_field_errors', response.data)
        self.assertIn('Unable to log in with provided credentials.', response.data['non_field_errors'])

    # User Logout

    def test_user_logout_success(self):
        # login to get auth key
        login_data = {
            'username': self.test_username,
            'password': self.test_password
        }
        login_response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        auth_key = login_response.data.get('key') # 或 'access_token'

        # logout with the auth key
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {auth_key}')

        logout_response = self.client.post(self.logout_url, {}, format='json')
        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)
        self.assertIn('detail', logout_response.data)
        self.assertEqual(logout_response.data['detail'], 'Successfully logged out.')

        # verify that the key is no longer valid
        # todo: need to check if the user is logged out
        # response_after_logout = self.client.get(reverse('user_details')) # 假设有一个用户详情接口
        # self.assertEqual(response_after_logout.status_code, status.HTTP_401_UNAUTHORIZED)