import os
import csv
from django.db.models import Avg
from django.contrib.auth.hashers import make_password
from django.contrib.gis.geos import Point

#The following commands are necessary in order to use the Django models in this script.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backendManager.settings")
import django
django.setup()

import django.db.models
import pandas as pd
from backendManager import settings
from django.conf import settings
from django.apps import apps
from users.models import *
from rooms.models import *

#Getting unique host ids from the listings dataframe.
listings_df = pd.read_csv(r'/home/pantmal/Documents/backend/src/backendManager/new_listings.csv' )
id_list = listings_df.drop_duplicates(subset=['host_id'])['host_id'].tolist()

#Getting unique reviewer ids from the reviews dataframe (so they can be used as renters).
reviews_df = pd.read_csv(r'/home/pantmal/Documents/backend/src/backendManager/new_reviews.csv' )
rev_id_list = reviews_df.drop_duplicates(subset=['reviewer_id'])['reviewer_id'].tolist()

#print(len(rev_id_list))
#print(reviews_df['reviewer_id'].nunique())
#print(len(id_list))
#print(listings_df['host_id'].nunique())
#print(any(x in rev_id_list for x in id_list))

#Adding users with both host and renter capabilities in a different list.
host_renter = []
c = 0
for x in id_list:
    if x in rev_id_list:
        host_renter.append(x)

#Removing the host+renters from the other lists.
for x in id_list:
    if x in rev_id_list:   
        id_list.remove(x)
        rev_id_list.remove(x)

for x in id_list:
    if x in rev_id_list:
        id_list.remove(x)
        rev_id_list.remove(x)     


# print(len(host_renter))
# print(len(rev_id_list))
# print(reviews_df['reviewer_id'].nunique())
# print(len(id_list))
# print(listings_df['host_id'].nunique())        

#Use the following lines to delete the users from the dataframes if there is a problem
# CustomUser.objects.filter(email="userHost@gmail.com").delete()
# CustomUser.objects.filter(email="userHostRen@gmail.com").delete()
# CustomUser.objects.filter(email="userRen@gmail.com").delete()

#Note: If you need to add only specific items from the dataset, make sure to comment out the ones you already added, so there won't be any duplicates.

#Adding host+renters in the database.
for _id in host_renter:
    user = CustomUser(
        username="User"+str(_id),
        password=make_password('user1998', hasher='default'),
        first_name="Us",
        last_name="Er",
        email="userHostRen@gmail.com",
        is_staff=False,
        telephone="12345",
        approved=True,
        is_host=True,
        is_renter=True,
        picture="user_images/User1.jpg",
        secondary_id=_id
        )
    user.save()

#Adding hosts in the database.
for _id in id_list:
    user = CustomUser(
        username="User"+str(_id),
        password=make_password('user1998', hasher='default'),
        first_name="Us",
        last_name="Er",
        email="userHost@gmail.com",
        is_staff=False,
        telephone="12345",
        approved=True,
        is_host=True,
        is_renter=False,
        picture="user_images/User1.jpg",
        secondary_id=_id
        )
    user.save()

#Adding renters in the database.
for _id in rev_id_list:
   user = CustomUser(
       username="User"+str(_id),
       password=make_password('user1998', hasher='default'),
       first_name="Us",
       last_name="Er",
       email="userRen@gmail.com",
       is_staff=False,
       telephone="12345",
       approved=True,
       is_host=False,
       is_renter=True,
       picture="user_images/User1.jpg",
       secondary_id=_id
       )
   user.save()

#Use the following line to delete the rooms from the dataframes if there is a problem
# Room.objects.exclude(secondary_id=1).delete()

#Adding rooms in the database.
with open('/home/pantmal/Documents/backend/src/backendManager/new_listings.csv') as f:
    reader = csv.reader(f)
    for row in reader:
        if(row[1]=='id'):
            continue
        point = Point(float(row[4]), float(row[3]))
        room = Room(
            name=row[2],
            geolocation=point,
            street=row[5],
            neighborhood=row[6],
            city=row[19],
            country=row[20],
            transit=row[7],
            start_date=row[33],
            end_date=row[34],
            price=float(row[8]),
            price_per_person=float(row[9]),
            max_people=row[10],
            beds=float(row[11]),
            bedrooms=float(row[12]),
            bathrooms=float(row[13]),
            rep_photo='room_images/house.jpg',
            room_type=row[14],
            has_wifi=row[21],
            has_heating=row[22],
            has_freezer=row[23],
            has_kitchen=row[24],
            has_TV=row[25],
            has_parking=row[26],
            has_elevator=row[27],
            has_living_room=row[28],
            square_feet=float(row[15]),
            description=row[16],
            smoking=row[29],
            pets=row[30],
            events=row[31],
            minimum_nights=float(row[17]),
            host_id=CustomUser.objects.get(secondary_id=row[18]),
            secondary_id=row[1]
            )
        room.save()

#Use the following line to delete the reviews from the dataframes if there is a problem. (Note: untested)
# RoomRating.objects.exclude(secondary_id=1).delete()

#Adding reviews in the database.
with open('/home/pantmal/Documents/backend/src/backendManager/new_reviews.csv') as f:
    reader = csv.reader(f)
    for row in reader:
        if(row[2]=='id'):
            continue
        
        rating = RoomRating(
            room_id_rate=Room.objects.get(secondary_id=row[1]),
            renter_id_rate=CustomUser.objects.get(secondary_id=row[4]),
            date=row[3],
            rating=float(row[5]),
            secondary_id=row[2]
            )
        rating.save()