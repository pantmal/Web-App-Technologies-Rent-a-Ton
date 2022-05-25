from django.contrib.gis.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

# Create your models here.

#Defining a CustomUser who extends the AbstractUser class.
class CustomUser(AbstractUser):

    #inherited fields: username, email, first_name, last_name, password, is_staff 
   
    telephone = models.CharField(max_length=100)
    approved = models.BooleanField(default=True)
    is_host = models.BooleanField(default=False)
    is_renter = models.BooleanField(default=False)
    picture = models.FileField(upload_to='user_images',blank=True,null=True)
    secondary_id = models.IntegerField()

#Check sometime: proper extend of user model

#Defining the Message class used by users.
class Message(models.Model):

    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='sender', on_delete=models.CASCADE, null=False)
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='receiver', on_delete=models.CASCADE, null=False)
    sender_name = models.CharField(max_length=100)
    receiver_name = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    content = models.TextField(max_length=7000, null=False)
    date = models.DateTimeField(null=False)    
