from django.urls import path, include

urlpatterns = [
    path('', include('dj_rest_auth.urls')), # including login, logout
    path('signup/', include('dj_rest_auth.registration.urls')), 
    path('accounts/', include('allauth.urls')), # allauth urls for account management, including social login
    path('social/', include('dj_rest_auth.registration.urls')), # social login URLs
]
