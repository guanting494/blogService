from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .github import get_github_token, get_github_user, get_or_create_user
import traceback

@api_view(['POST'])
@permission_classes([AllowAny])
def github_callback(request):
    """Handle GitHub OAuth callback"""
    code = request.data.get('code')
    print(f"Received GitHub callback with code: {code[:10]}..." if code else "No code received")
    
    if not code:
        return Response(
            {'error': 'No code provided'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Exchange code for access token
        access_token = get_github_token(code)
        print(f"Successfully obtained GitHub access token")
            
        # Get GitHub user data
        github_user = get_github_user(access_token)
        if not github_user:
            return Response(
                {'error': 'Failed to get GitHub user data'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        print(f"Successfully obtained GitHub user data: {github_user.get('login')}")
            
        # Get or create user
        user = get_or_create_user(github_user, access_token)
        print(f"User processed successfully: {user.username}")
            
        # Generate auth token
        token, created = Token.objects.get_or_create(user=user)
        print(f"Auth token {'created' if created else 'retrieved'}: {token.key}")
        
        # Prepare the response
        response_data = {
            'key': token.key,
            'user': {
                'username': user.username,
                'email': user.email
            }
        }
        print(f"Sending successful response: {response_data}")
        return Response(response_data)
        
    except Exception as e:
        
        error_msg = f"GitHub login failed: {str(e)}"
        print(error_msg)
        print(traceback.format_exc())
        return Response(
            {'error': error_msg}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
