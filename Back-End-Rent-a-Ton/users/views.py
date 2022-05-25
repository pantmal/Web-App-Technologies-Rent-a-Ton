from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from .models import *
from .serializers import *
from permissions import *

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response


# Create your views here.

#Using ViewSet for the users.
class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        """
        Any user can view or create another user. 
        Only admins and authenticated users can update user-data.
        Only admins can delete other users.
        """
        permission_classes = []
        if self.action == 'list' or self.action == 'retrieve' or self.action=='create':
            permission_classes = [AllowAny]
        if self.action == 'update' or self.action == 'partial_update':
            permission_classes = [IsAdminUser|IsAuthenticated]
        if self.action == 'destroy':
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]


#Using ViewSet for the messages.
class MessageViewSet(viewsets.ModelViewSet):

    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def get_permissions(self):
        """
        Only hosts and renters can handle messages.
        """
    
        permission_classes = [IsHostUser|IsRenterUser]
        return [permission() for permission in permission_classes]


#Returing a user item by his username.
class GetUserByName(APIView):

    #Any user can access this view.
    permission_classes = [AllowAny]

    def post(self, request, format=None):

        #Getting the username and checking if it exists.
        name = request.data['username']
        case = CustomUser.objects.filter(username=name).exists()

        #If the user exists serialize the user item and return it. Otherwise return 'not found'.
        if case == True:
            user = CustomUser.objects.get(username=name)
            userSerializer = UserSerializer(user)
            return Response(userSerializer.data)
        else:
            return Response('not found')

#Getting messages of a user.
class GetMessages(APIView):

    #Only hosts and renters can handle messages.
    permission_classes = [IsHostUser|IsRenterUser]

    def post(self, request, format=None):

        msg_type = request.data['type']        
        user_id = request.data['id']
        
        #Returning sent messages for this user, if they exist.
        if msg_type == 'sent':
            case = Message.objects.filter(sender=user_id).exists()
            if case == True:
                messages = Message.objects.filter(sender=user_id)
                msgs_to_return = messages
                msg_Serializer = MessageSerializer(msgs_to_return, many=True)
                return Response(msg_Serializer.data)
            else:
                return Response('not found')
        #Returning received messages for this user, if they exist.
        elif msg_type == 'rec':
            case = Message.objects.filter(receiver=user_id).exists()
            if case == True:
                messages = Message.objects.filter(receiver=user_id)
                msgs_to_return = messages
                msg_Serializer = MessageSerializer(msgs_to_return, many=True)
                return Response(msg_Serializer.data)
            else:
                return Response('not found')

#Changing the approved status of a host.
class approveUser(APIView):

    #Used only by admins.
    permission_classes = [IsAdminUser]

    def post(self, request, format=None):
        
        #Getting the user whose status is to be changed.
        response_act = request.data['activation']
        response_id = request.data['ID']
        user = CustomUser.objects.get(pk=response_id)

        #Changing his status if he is a host.
        if user.is_host == True:
            user.approved = response_act
        user.save()

        return Response(status = status.HTTP_200_OK)