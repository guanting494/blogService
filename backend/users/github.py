import requests
from django.conf import settings
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

def get_github_token(code):
    """Exchange code for access token"""
    try:
        print(f"Attempting to exchange code for token with GitHub...")
        resp = requests.post(
            'https://github.com/login/oauth/access_token',
            data={
                'client_id': settings.GITHUB_CLIENT_ID,
                'client_secret': settings.GITHUB_CLIENT_SECRET,
                'code': code,
            },
            headers={'Accept': 'application/json'}
        )
        resp.raise_for_status()
        response_data = resp.json()
        print(f"GitHub token response: {response_data}")
        
        if 'error' in response_data:
            error_msg = f"GitHub returned an error: {response_data['error']}"
            print(error_msg)
            raise Exception(error_msg)
            
        access_token = response_data.get('access_token')
        if not access_token:
            error_msg = "No access_token in GitHub response"
            print(error_msg)
            raise Exception(error_msg)
            
        return access_token
    except requests.exceptions.RequestException as e:
        error_msg = f"Network error while getting GitHub token: {str(e)}"
        print(error_msg)
        raise Exception(error_msg)
    except Exception as e:
        error_msg = f"Error getting GitHub token: {str(e)}"
        print(error_msg)
        raise

def get_github_user(access_token):
    """Get GitHub user information"""
    try:
        resp = requests.get(
            'https://api.github.com/user',
            headers={
                'Authorization': f'token {access_token}',
                'Accept': 'application/json',
            }
        )
        resp.raise_for_status()  # Raise an exception for bad status codes
        return resp.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching GitHub user: {str(e)}")
        return None

def get_github_emails(access_token):
    """Get user's GitHub email addresses"""
    try:
        resp = requests.get(
            'https://api.github.com/user/emails',
            headers={
                'Authorization': f'token {access_token}',
                'Accept': 'application/json',
            }
        )
        resp.raise_for_status()
        return resp.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching GitHub emails: {str(e)}")
        return []

def get_or_create_user(github_user, access_token):
    """Get existing user or create new one based on GitHub data"""
    email = github_user.get('email')
    if not email:
        # If email is private, try to get primary email from email endpoint
        emails = get_github_emails(access_token)
        primary_email = next(
            (email['email'] for email in emails if email['primary']),
            None
        )
        email = primary_email or f"{github_user['login']}@github.user"

    try:
        print(f"Attempting to create/get user with email: {email}")
        try:
            user = User.objects.get(email=email)
            print(f"Found existing user with email: {email}")
            
            if user.username != github_user['login']:
                user.username = github_user['login']
                user.save()
                
        except User.DoesNotExist:
            random_password = str(uuid.uuid4())  # generate a random password
            user = User.objects.create_user(
                email=email,
                username=github_user['login'],
                password=random_password
            )
            print(f"Created new user with email: {email}")
            
        return user
        
    except Exception as e:
        print(f"Error creating/getting user: {str(e)}")
        raise
