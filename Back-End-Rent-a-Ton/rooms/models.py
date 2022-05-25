from django.contrib.gis.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.

#Defining the Room model.
class Room(models.Model):

    PRIV = "Private room"
    SHARE = "Shared room"
    ENTIRE = "Entire home/apt"
    
    ROOM_CHOICES = (
        (PRIV, "PRIVATE ROOM"),
        (SHARE, "SHARED ROOM"),
        (ENTIRE, "ENTIRE HOUSE")
    )

    name = models.CharField(max_length=500, null=False)
    geolocation = models.PointField(null=False)
    street = models.CharField(max_length=100, null=False)
    neighborhood = models.CharField(max_length=50, null=False)
    city = models.CharField(max_length=50, null=False)
    country = models.CharField(max_length=50, null=False)
    transit = models.CharField(max_length=2000, null=False)
    start_date = models.DateField(null=False)
    end_date = models.DateField(null=False)
    price = models.FloatField(null=False)
    price_per_person = models.FloatField(null=False)
    max_people = models.IntegerField()
    beds = models.IntegerField()
    bedrooms = models.IntegerField()
    bathrooms = models.IntegerField()
    rep_photo = models.FileField(upload_to='room_images',blank=True,null=False)
    room_type = models.CharField(choices=ROOM_CHOICES, default=ENTIRE, max_length=20)
    has_wifi = models.BooleanField(default=False)
    has_heating = models.BooleanField(default=False)
    has_freezer = models.BooleanField(default=False)
    has_kitchen = models.BooleanField(default=False)
    has_TV = models.BooleanField(default=False)
    has_parking = models.BooleanField(default=False)
    has_elevator = models.BooleanField(default=False)
    has_living_room = models.BooleanField(default=False)
    square_feet = models.FloatField(null=False)
    description = models.TextField(max_length=2000, null=False)
    smoking = models.BooleanField(default=False)
    pets = models.BooleanField(default=False)
    events = models.BooleanField(default=False)
    minimum_nights = models.IntegerField()
    host_id = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='host', on_delete=models.CASCADE, null=False)
    secondary_id = models.IntegerField()

#Defining the Room Image model (used whenever a room has more than one image).
class RoomImage(models.Model):

    room_id_img = models.ForeignKey(Room, related_name='room_img', on_delete=models.CASCADE, null=False)
    picture = models.FileField(upload_to='user_images',blank=True,null=True)

#Defining the Room Rating model.
class RoomRating(models.Model):

    room_id_rate = models.ForeignKey(Room, related_name='room_rate', on_delete=models.CASCADE, null=False)
    renter_id_rate = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='renter_rate', on_delete=models.CASCADE, null=False)
    date = models.DateField(null=False)
    rating = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(5.0)])
    secondary_id = models.IntegerField()

#Defining the Host Rating model.
class HostRating(models.Model):

    host_id_hostRate = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='host_hostRate', on_delete=models.CASCADE, null=False)
    renter_id_hostRate = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='renter_hostRate', on_delete=models.CASCADE, null=False)
    date = models.DateField(null=False)
    rating = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(5.0)])

#Defining the Reservation model.
class Reservation(models.Model):

    room_id_res = models.ForeignKey(Room, related_name='room_res', on_delete=models.CASCADE, null=False)
    renter_id_res = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='renter_res', on_delete=models.CASCADE, null=False)
    start_date = models.DateField(null=False)
    end_date = models.DateField(null=False)

#Defining the ClickedItem model (used for the Recommendation system).
class ClickedItem(models.Model):

    room_id_click = models.ForeignKey(Room, related_name='room_click', on_delete=models.CASCADE, null=False)
    renter_id_click = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='renter_click', on_delete=models.CASCADE, null=False)

#Defining the SearchedItem model (used for the Recommendation system).
class SearchedItem(models.Model):

    room_id_search = models.ForeignKey(Room, related_name='room_search', on_delete=models.CASCADE, null=False)
    renter_id_search = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='renter_search', on_delete=models.CASCADE, null=False)

#Defining the Recommendation model (used for the Recommendation system).
class Recommendation(models.Model):

    room_id_rec = models.ForeignKey(Room, related_name='room_recom', on_delete=models.CASCADE, null=False)
    renter_id_rec = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='renter_recom', on_delete=models.CASCADE, null=False)