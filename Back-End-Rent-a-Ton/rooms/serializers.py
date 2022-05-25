from rest_framework import serializers
from .models import *


#Defining a Serializer class for the Rooms.
class RoomSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Room #Model to serialize

        #Fields to be returned 
        fields = ['pk', 'name', 'geolocation', 'street', 'neighborhood','city','country', 'transit', 'start_date', 'end_date', 
        'price', 'price_per_person', 'max_people', 'beds', 'bedrooms', 'bathrooms', 'rep_photo', 'room_type',
        'has_wifi', 'has_heating', 'has_freezer', 'has_kitchen', 'has_TV', 'has_parking', 'has_elevator',
        'has_living_room', 'square_feet', 'description', 'smoking', 'pets', 'events', 'minimum_nights',
        'host_id', 'secondary_id' 
        ]
        
class RoomImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = RoomImage #Model to serialize
        
        #Fields to be returned 
        fields = ['pk', 'room_id_img', 'picture']


class RoomRatingSerializer(serializers.ModelSerializer):

    class Meta:
        model = RoomRating #Model to serialize

        #Fields to be returned 
        fields = ['pk', 'room_id_rate', 'renter_id_rate', 'date', 'rating', 'secondary_id']


class HostRatingSerializer(serializers.ModelSerializer):

    class Meta:
        model = HostRating #Model to serialize

        #Fields to be returned 
        fields = ['pk', 'host_id_hostRate', 'renter_id_hostRate', 'date', 'rating']


class ReservationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Reservation #Model to serialize

        #Fields to be returned 
        fields = ['pk', 'room_id_res', 'renter_id_res', 'start_date', 'end_date']


class ClickedItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = ClickedItem #Model to serialize

        #Fields to be returned 
        fields = ['pk', 'room_id_click', 'renter_id_click']

class SearchedItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = SearchedItem #Model to serialize

        #Fields to be returned 
        fields = ['pk', 'room_id_search', 'renter_id_search']

class RecommendationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Recommendation #Model to serialize

        #Fields to be returned 
        fields = ['pk', 'room_id_rec', 'renter_id_rec']        