import pandas as pd
import glob 
import os
import numpy as np
from textblob import TextBlob
import nltk
 

#downloading necessery toolkits
nltk.download("wordnet")
nltk.download("brown")

df_listings=pd.read_csv(r'/home/pantmal/Documents/backend/src/backendManager/listings.csv' )
df_calendar=pd.read_csv(r'/home/pantmal/Documents/backend/src/backendManager/calendar.csv' )

#keep the columns we need
df_listings=df_listings[['id','name','latitude','longitude','street', 'neighbourhood','transit','price','extra_people',
          'accommodates','beds' ,'bedrooms','bathrooms','room_type',
                         'amenities','square_feet','description','minimum_nights','host_id','city','country']]

df_listings['price'] = df_listings['price'].replace({'\$': ''}, regex=True)
df_listings['extra_people'] = df_listings['extra_people'].replace({'\$': ''}, regex=True)

#extra columns needed
df_listings['has_wifi']=False
df_listings['has_heating']=False 
df_listings['has_freezer']=False 
df_listings['has_kitchen']=False 
df_listings['has_TV']=False      
df_listings['has_parking']=False 
df_listings['has_elevator']=False 
df_listings['has_living_room']=False 
df_listings['smoking']=False
df_listings['pets']=False
df_listings['events']=False
df_listings['reserved']=False


#make lists into strings without whitespaces
df_listings['amenities']=df_listings['amenities'].apply(', '.join)
df_listings['amenities']=df_listings['amenities'] = df_listings['amenities'].str.replace(',', '')
df_listings['amenities']=df_listings['amenities'] = df_listings['amenities'].str.replace(' ', '')

#convert the description column to string(normally includes integers and floats)
df_listings['description']=df_listings['description'].astype(str)
#df_listings['summary']=df_listings['summary'].astype(str)

#fill the extra columns with True/False values
for row in range(0,len(df_listings)):
    if 'WirelessInternet' in df_listings.loc[row]['amenities']:
        df_listings.at[row,'has_wifi']=True
    if 'Heating' in df_listings.loc[row]['amenities']:
        df_listings.at[row,'has_heating']=True
    if 'Kitchen' in df_listings.loc[row]['amenities']:
        df_listings.at[row,'has_kitchen']=True
    if 'TV' in df_listings.loc[row]['amenities']:
        df_listings.at[row,'has_TV']=True
    if 'Parking' in df_listings.loc[row]['amenities']:
        df_listings.at[row,'has_parking']=True
    if 'Elevator' in df_listings.loc[row]['amenities']:
        df_listings.at[row,'has_elevator']=True
    if 'SmokingAllowed' in df_listings.loc[row]['amenities']:
        df_listings.at[row,'smoking']=True
    if 'PetsAllowed' in df_listings.loc[row]['amenities']:
        df_listings.at[row,'pets']=True
    #has_freezer has_living_room and events dont have keywords in amenities
    if 'freezer' in df_listings.loc[row]['description']:
        df_listings.at[row,'has_freezer']=True
    if 'living room' in df_listings.loc[row]['description']:
        df_listings.at[row,'has_living_room']=True
    if   'events' in df_listings.loc[row]['description']:
        df_listings.at[row,'events']=True

                
#replace NaN values with 0.0 -transit gets filled with null
df_listings.fillna(df_listings.dtypes.replace({'float64': 0.0, 'O': 'NULL'}), inplace=True)        
        
#calculate max of some columns to fill the missing data
square_feet_value=df_listings['square_feet'].max()
bathrooms_value=df_listings['bathrooms'].max()
bedrooms_value=df_listings['bedrooms'].max()
beds_value=df_listings['beds'].max()

#lists of the available values for neighbourhood and transit columns
neighbourhood_list=df_listings['neighbourhood'].unique()
neighbourhood_list_len=len(neighbourhood_list)
transit_list=df_listings['transit'].unique()
transit_list_len=len(transit_list)


#change 0 values to sth useful
#also fill in the neighbourhood and transit columns
for row in range(0,len(df_listings)):
    if df_listings.loc[row,'square_feet']==0:
        df_listings.at[row,'square_feet']=np.random.randint(0, square_feet_value)
    if df_listings.loc[row,'bathrooms']==0:
        df_listings.at[row,'bathrooms']=np.random.randint(0, bathrooms_value)
    if df_listings.loc[row,'bedrooms']==0:
        df_listings.at[row,'bedrooms']=np.random.randint(0, bedrooms_value)
    if df_listings.loc[row,'beds']==0:
        df_listings.at[row,'beds']=np.random.randint(0, beds_value)
    if df_listings.loc[row,'neighbourhood']=="NULL":
        df_listings.at[row,'neighbourhood']=neighbourhood_list[np.random.randint(3, neighbourhood_list_len)]
    if df_listings.loc[row,'transit']=="NULL":
        df_listings.at[row,'transit']=transit_list[np.random.randint(3, transit_list_len)]    

#count the unique host id values
print(df_listings['host_id'].nunique())      
print(df_listings['id'].nunique())      
# df_listings['square_feet']=df_listings['square_feet'].astype(float)
df_listings=df_listings.dropna()
# with pd.option_context('display.max_rows', None, 'display.max_columns', None): 
#     print(df_listings)


#drop the NaN values(there arent any used for testing purposes-does nothing)
df_listings.isna().any() 

#df_listings['price'].tail(255)
    ######print the whole df
# with pd.option_context('display.max_rows', None, 'display.max_columns', None): 
#     print(df_listings['events'])
    #####check which columns have null values
    ######print one full line of description
    
    
#convert dates to the correct type    
df_calendar['date'] = pd.to_datetime(df_calendar['date'])
#create the dataframe we need(we save the first and last value for each of the unique ids)
df_temp=df_calendar.groupby('listing_id')['date'].agg(['first','last'])
#now we need to merge the two dfs into a single one
df_final = df_listings.merge(df_temp, how='inner', left_on='id', right_on='listing_id')


df_final = df_final.drop(columns=['amenities'])

df_final.to_csv('/home/pantmal/Documents/backend/src/backendManager/new_listings.csv')

#read the file
df_reviews=pd.read_csv(r'/home/pantmal/Documents/backend/src/backendManager/reviews.csv' )

#convert comments column to string
df_reviews['comments']=df_reviews['comments'].astype(str)

#keep the columns we need
df_reviews=df_reviews[['listing_id','id','date','reviewer_id','comments']]

print(df_reviews['id'].nunique())  
print(df_reviews['listing_id'].nunique())  
print(df_reviews['reviewer_id'].nunique())      
# with pd.option_context('display.max_rows', None, 'display.max_columns', None): 
#     print(df_reviews.head(20))
#find polarity(sentiment of a text) for every row in the dataframe
#polarity returns a decimal point number in the range of[-1,1].We want the range to be  [0,5] so 
#we do the necessary conversions and rounding

for row in range(0,len(df_reviews)):
    blob=TextBlob(df_reviews.loc[row,'comments'])
    temp=(blob.polarity*2)+3
    temp=round(temp,1)
    df_reviews.at[row,'comments']=temp
df_reviews.to_csv('/home/pantmal/Documents/backend/src/backendManager/new_reviews.csv')