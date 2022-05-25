from django.urls import path, include
from .views import UserViewSet
from rest_framework import routers

from users.views import *

#Defining the user-related URLs of the django server, using our views. 

#Using viewsets for the models.
router = routers.DefaultRouter()
router.register(r'userList', UserViewSet)
router.register(r'messageList', MessageViewSet)

#Getting the other classes as views.
approveUser_view = approveUser.as_view()
GetUserByName_view = GetUserByName.as_view()
getMessages_view = GetMessages.as_view()

#Defining URL patterns.
urlpatterns = [
    path(r'', include(router.urls)),
    path(r'authentication/', include('rest_auth.urls')),
    path('getUserByName/', GetUserByName_view, name='get-user-by-name'),
    path('getMessages/', getMessages_view, name='get-messages'),
    path('approveUser/', approveUser_view, name='approve-user')
] 
