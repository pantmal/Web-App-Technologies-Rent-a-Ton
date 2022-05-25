from django.urls import path, include
from .views import *
from rest_framework import routers

from rooms.views import *

#Defining the room-related URLs of the django server, using our views. 

#Using viewsets for the models.
router = routers.DefaultRouter()
router.register(r'roomList', RoomViewSet)
router.register(r'roomImages', RoomImageViewSet)
router.register(r'roomRatings', RoomRatingViewSet)
router.register(r'hostRatings', HostRatingViewSet)
router.register(r'reservations', ReservationViewSet)
router.register(r'clickedItems', ClickedItemViewSet)
router.register(r'searchedItems', SearchedItemViewSet)
router.register(r'recommendations', RecommendationViewSet)

#Getting the other classes as views.
searchView = SearchRooms.as_view()
getImagesView = GetImages.as_view()
addSearchesClicks = AddSearchesClicks.as_view()
resCheck = ReservationCheck.as_view()
ratCheck = RatingCheck.as_view()
ratCount = RatingCount.as_view()
exportData = ExportData.as_view()

#Defining URL patterns.
urlpatterns = [

    path(r'', include(router.urls)),
    path('search/', searchView, name='search-rooms'),
    path('getImages/', getImagesView, name='get-images'),
    path('addSearchesClicks/', addSearchesClicks, name='add-searches-clicks'),
    path('resCheck/', resCheck, name='res-check'),
    path('ratCheck/', ratCheck, name='rat-check'),
    path('ratCount/', ratCount, name='rat-count'),
    path('exportData/', exportData, name='export-data')
] 