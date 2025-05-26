from django.urls import path,include

urlpatterns = [
    # OAuth
    path('', include('dj_rest_auth.urls')), # including login, logout
    path('signup/', include('dj_rest_auth.registration.urls')),
    path('social/', include('allauth.socialaccount.urls')),
]
