// @flow
import React from 'react';
import {Component} from 'react';
import {Link} from 'react-router-dom';

import AwesomeSlider from "react-awesome-slider";
import AwesomeSliderStyles from 'react-awesome-slider/src/styles';

import axios from '../AXIOS_conf'
import 'leaflet/dist/leaflet.css'

import CreateMap from './CreateMap.js'

//HostPage used so the hosts can create a new room or navigate to their existing rooms.
class HostPage extends Component{

    constructor(props){
        super(props)

        this.state = {
            approved: false,
            name: '',
            street: '',
            hood: '',
            city:'',
            country:'',
            transit: '',
            s_date: '',
            e_date: '',
            price:'',
            extra_price:'',
            max_people:'',
            beds:'',
            bedrooms:'',
            bathrooms:'',
            picture: '',
            imagePreviewUrl: '',
            room_type:'',
            wifi: false,
            heating: false,
            freezer: false,
            kitchen: false,
            TV: false,
            parking: false,
            elevator: false,
            living_room: false,
            feet: '',
            desc:'',
            smoking: false,
            pets: false,
            events: false,
            min_nights: '',
            lat: '',
            lng: '',
            handleGeoChange: this.handleGeoChange,
            files: [],
            imagesPreviewUrls: [],
            errors: {}
        }

        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleAddressChange = this.handleAddressChange.bind(this)
        this.handleHoodChange = this.handleHoodChange.bind(this)
        this.handleCityChange = this.handleCityChange.bind(this)
        this.handleCountryChange = this.handleCountryChange.bind(this)
        this.handleTransitChange = this.handleTransitChange.bind(this)
        this.handleStartDateChange = this.handleStartDateChange.bind(this) 
        this.handleEndDateChange = this.handleEndDateChange.bind(this)
        this.handlePeopleChange = this.handlePeopleChange.bind(this)
        this.handlePriceChange = this.handlePriceChange.bind(this)
        this.handleExtraPriceChange = this.handleExtraPriceChange.bind(this)
        this.handleRadioChange = this.handleRadioChange.bind(this)
        this.handleImageChange = this.handleImageChange.bind(this)
        this.handleBedsChange = this.handleBedsChange.bind(this)
        this.handleBedroomsChange = this.handleBedroomsChange.bind(this)
        this.handleBathroomsChange = this.handleBathroomsChange.bind(this)
        this.handleFeetChange = this.handleFeetChange.bind(this)
        this.handleDescChange = this.handleDescChange.bind(this)
        this.handleWiFiChange = this.handleWiFiChange.bind(this)
        this.handleFreezerChange = this.handleFreezerChange.bind(this)
        this.handleHeatingChange = this.handleHeatingChange.bind(this)
        this.handleKitchenChange = this.handleKitchenChange.bind(this)
        this.handleTVChange = this.handleTVChange.bind(this)
        this.handleParkingChange = this.handleParkingChange.bind(this)
        this.handleElevatorChange = this.handleElevatorChange.bind(this)
        this.handleLivingRoomChange = this.handleLivingRoomChange.bind(this)
        this.handleSmokingChange = this.handleSmokingChange.bind(this)
        this.handlePetsChange = this.handlePetsChange.bind(this)
        this.handleEventsChange = this.handleEventsChange.bind(this)
        this.handleMinNightsChange = this.handleMinNightsChange.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
        this.handleGeoChange = this.handleGeoChange.bind(this)
        this.handleMultipleImageChange = this.handleMultipleImageChange.bind(this)

    }

    //When the component mounts we get the details of the user that is viewing the page.
    componentDidMount(){

        const id = this.props.app_state.user_primary_key
        axios.get(`users/userList/${id}`/*,
      {
        headers: {
          Authorization: `JWT ${localStorage.getItem('storage_token')}`
        }}*/).then(response => { const user = response.data;
        this.setState({
        approved: user.approved
        })
        }).catch(error => {console.log(error.response);})
    }

    
    //The following event handles are used to update the values of the form that adds a new room.

    handleNameChange = event => {
        const form_name = event.target.value
        this.setState({
            name: form_name
        })
    }

    handleAddressChange = event => {
        const form_street = event.target.value
        this.setState({
            street: form_street
        })
    }

    handleHoodChange = event => {
        const form_hood = event.target.value
        this.setState({
            hood: form_hood
        })
    }

    handleCityChange = event => {
        const form_city = event.target.value
        this.setState({
            city: form_city
        })
    }

    handleCountryChange = event => {
        const form_country = event.target.value
        this.setState({
            country: form_country
        })
    }

    handleTransitChange = event => {
        const form_trans = event.target.value
        this.setState({
            transit: form_trans
        })
    }

    handleStartDateChange = event => {
        const form_s_date = event.target.value
        this.setState({
            s_date: form_s_date
        })
    }

    handleEndDateChange = event => {
        const form_e_date = event.target.value
        this.setState({
            e_date: form_e_date
        })
    }

    handlePeopleChange = event => {
        const form_people = event.target.value
        this.setState({
            max_people: form_people
        })
    }

    handlePriceChange = event => {
        const form_price = event.target.value
        this.setState({
            price: form_price
        })
    }

    handleExtraPriceChange = event => {
        const form_extra = event.target.value
        this.setState({
            extra_price: form_extra
        })
    }

    handleRadioChange = (event) => {
        this.setState({
          room_type: event.target.value
        });
    }

    //Using FileReader() for image changes.
    handleImageChange = event => {
        event.preventDefault();
    
        let f_reader = new FileReader();
        let file = event.target.files[0];
    
        f_reader.onloadend = () => {
          this.setState({
            picture: file,
            imagePreviewUrl: f_reader.result
          });
        }
        
        f_reader.readAsDataURL(file)
    }

    handleMultipleImageChange = event =>{
        event.preventDefault();

        let files = Array.from(event.target.files);
 
        files.forEach((file, i) => {
            let f_reader = new FileReader();

            f_reader.onloadend = () => {
                this.setState(prevState => ({
                    files: [...prevState.files, file],
                    imagesPreviewUrls: [...prevState.imagesPreviewUrls, f_reader.result]
                }));
            }

            f_reader.readAsDataURL(file);
        });
    }

    handleBedsChange = event => {
        const form_beds = event.target.value
        this.setState({
            beds: form_beds
        })
    }

    handleBedroomsChange = event => {
        const form_bedrooms = event.target.value
        this.setState({
            bedrooms: form_bedrooms
        })
    }

    handleBathroomsChange = event => {
        const form_bathrooms = event.target.value
        this.setState({
            bathrooms: form_bathrooms
        })
    }

    handleFeetChange = event => {
        const form_feet = event.target.value
        this.setState({
            feet: form_feet
        })
    }

    handleDescChange = event => {
        const form_desc = event.target.value
        this.setState({
            desc: form_desc
        })
    }

    handleWiFiChange = event => {
        this.setState(prevState => {return{
            wifi: !prevState.wifi
        }})
    }

    handleFreezerChange = event => {
        this.setState(prevState => {return{
            freezer: !prevState.freezer
        }})
    }

    handleHeatingChange = event => {
        this.setState(prevState => {return{
            heating: !prevState.heating
        }})
    }
    
    handleKitchenChange = event => {
        this.setState(prevState => {return{
            kitchen: !prevState.kitchen
        }})
    }

    handleTVChange = event => {
        this.setState(prevState => {return{
            TV: !prevState.TV
        }})
    }

    handleParkingChange = event => {
        this.setState(prevState => {return{
            parking: !prevState.parking
        }})
    }
    
    handleElevatorChange = event => {
        this.setState(prevState => {return{
            elevator: !prevState.elevator
        }})
    }

    handleLivingRoomChange = event => {
        this.setState(prevState => {return{
            living_room: !prevState.living_room
        }})
    }

    handleSmokingChange = event => {
        this.setState(prevState => {return{
            smoking: !prevState.smoking
        }})
    }

    handlePetsChange = event => {
        this.setState(prevState => {return{
            pets: !prevState.pets
        }})
    }

    handleEventsChange = event => {
        this.setState(prevState => {return{
            events: !prevState.events
        }})
    }

    handleMinNightsChange = event => {
        const form_min = event.target.value
        this.setState({
            min_nights: form_min
        })
    }

    handleGeoChange = (landscape) => {
        this.setState({
            lat: landscape.lat,
            lng: landscape.lng
        })
        console.log(this.state)
    }

    //Validating the form data and setting the errors object accordingly.
    handleValidation(){ 
        
        let errors = {};
        let formIsValid = true;

        
        if(this.state.name == ''){
           formIsValid = false;
           errors["name"] = "\u2757Cannot be empty";
        }

        if(this.state.lat == '' || this.state.lng == ''){
            formIsValid = false;
            errors["geolocation"] = "\u2757Cannot be empty";
        }

        if(this.state.street == ''){
            formIsValid = false;
            errors["street"] = "\u2757Cannot be empty";
        }

        if(this.state.hood == ''){
            formIsValid = false;
            errors["hood"] = "\u2757Cannot be empty";
        }
 
         if(this.state.hood != ''){
             if(!this.state.hood.match(/^[a-zA-Z]+$/)){
                 formIsValid = false;
                 errors["hood"] = "\u2757Only letters";
             }        
         }
 
         if(this.state.city == ''){
             formIsValid = false;
             errors["city"] = "\u2757Cannot be empty";
         }
 
         if(this.state.city != ''){
             if(!this.state.city.match(/^[a-zA-Z]+$/)){
                 formIsValid = false;
                 errors["city"] = "\u2757Only letters";
             }        
         }
 
         if(this.state.country == ''){
             formIsValid = false;
             errors["country"] = "\u2757Cannot be empty";
         }
 
         if(this.state.country != ''){
             if(!this.state.country.match(/^[a-zA-Z]+$/)){
                 formIsValid = false;
                 errors["country"] = "\u2757Only letters";
             }        
         }

         if(this.state.transit == ''){
            formIsValid = false;
            errors["transit"] = "\u2757Cannot be empty";
        }

        if(this.state.s_date == ''){
            formIsValid = false;
            errors["s_date"] = "\u2757Cannot be empty";
        }

        if(this.state.e_date == ''){
            formIsValid = false;
            errors["e_date"] = "\u2757Cannot be empty";
        }

        if (this.state.s_date != ''  && this.state.e_date != ''){ //A little extra work for dates.
            let start_date = this.state.s_date
            let end_date = this.state.e_date

            let s_date_split = start_date.split("-");
            let e_date_split = end_date.split("-");

            let start_year = parseInt(s_date_split[0])
            let start_month = parseInt(s_date_split[1])
            let start_day = parseInt(s_date_split[2])

            let end_year = parseInt(e_date_split[0])
            let end_month = parseInt(e_date_split[1])
            let end_day = parseInt(e_date_split[2])
            
            if(start_year > end_year){
                formIsValid = false;
                errors["e_date"] = "\u2757End date must be after the starting date!";
            }

            if(start_year === end_year){
                if(start_month > end_month){
                    formIsValid = false;
                    errors["e_date"] = "\u2757End date must be after the starting date!";
                }
                if(start_month === end_month){
                    if(start_day > end_day){
                        formIsValid = false;
                        errors["e_date"] = "\u2757End date must be after the starting date!";
                    }
                }
            }

        }

        if(this.state.price == ''){
            formIsValid = false;
            errors["price"] = "\u2757Cannot be empty";
        }

        if(this.state.price != ''){
            if(!this.state.price.match(/^[0-9.]+$/)){ 
                formIsValid = false;
                errors["price"] = "\u2757Only numbers";
            }
        }

        if(this.state.extra_price == ''){
            formIsValid = false;
            errors["ext_price"] = "\u2757Cannot be empty";
        }

        if(this.state.extra_price != ''){
            if(!this.state.extra_price.match(/^[0-9.]+$/)){ 
                formIsValid = false;
                errors["ext_price"] = "\u2757Only numbers";
            }
        }
        

        if(this.state.max_people == ''){
            formIsValid = false;
            errors["max_people"] = "\u2757Cannot be empty";
        }

        if(this.state.max_people != ''){
            if(!this.state.max_people.match(/^[0-9]+$/)){ 
                formIsValid = false;
                errors["max_people"] = "\u2757Only numbers";
            }
        }

        if(this.state.beds == ''){
            formIsValid = false;
            errors["beds"] = "\u2757Cannot be empty";
        }
       
        if(this.state.beds != ''){
            if(!this.state.beds.match(/^[0-9]+$/)){ 
                formIsValid = false;
                errors["beds"] = "\u2757Only numbers";
            }
        }   

        if(this.state.bedrooms == ''){
            formIsValid = false;
            errors["bedrooms"] = "\u2757Cannot be empty";
        }

        if(this.state.bedrooms != ''){
            if(!this.state.bedrooms.match(/^[0-9]+$/)){ 
                formIsValid = false;
                errors["bedrooms"] = "\u2757Only numbers";
            }
        }

        if(this.state.bathrooms == ''){
            formIsValid = false;
            errors["bathrooms"] = "\u2757Cannot be empty";
        }

        if(this.state.bathrooms != ''){
            if(!this.state.bathrooms.match(/^[0-9]+$/)){ 
                formIsValid = false;
                errors["bathrooms"] = "\u2757Only numbers";
            }
        }

       
        if(this.state.picture == ''){
            formIsValid = false;
            errors["picture"] = "\u2757Cannot be empty";
        }


        if(this.state.room_type == ''){
            formIsValid = false;
            errors["room_type"] = "\u2757Cannot be empty";
        }

        if(this.state.feet == ''){
            formIsValid = false;
            errors["feet"] = "\u2757Cannot be empty";
        }

        if(this.state.feet != ''){
            if(!this.state.feet.match(/^[0-9.]+$/)){ 
                formIsValid = false;
                errors["feet"] = "\u2757Only numbers";
            }
        }

        if(this.state.desc == ''){
            formIsValid = false;
            errors["desc"] = "\u2757Cannot be empty";
        }


        if(this.state.min_nights == ''){
            formIsValid = false;
            errors["min_nights"] = "\u2757Cannot be empty";
        }

        if(this.state.min_nights != ''){
            if(!this.state.min_nights.match(/^[0-9]+$/)){ 
                formIsValid = false;
                errors["min_nights"] = "\u2757Only numbers";
            }
        }

        this.setState({errors: errors});

        return formIsValid;        

    }

    //If handleValidation() returns true, which means the data is ok, call proceedSubmission()
    handleFormSubmit = event => {
        event.preventDefault()

        if(this.handleValidation()){
            this.proceedSubmission()
        }

    }

    //In proceedSubmission() an axios.post request is made to add the room and its images in the database. 
    proceedSubmission(){
        //console.log(this.state)

        //Geolocation variable set in Django format.
        let geolocation = `POINT(${this.state.lng} ${this.state.lat})`

        const data = {
            name: this.state.name,
            geolocation: geolocation,
            street: this.state.street,
            neighborhood: this.state.hood,
            city: this.state.city,
            country: this.state.country,
            transit: this.state.transit,
            start_date: this.state.s_date,
            end_date: this.state.e_date,
            price: this.state.price,
            price_per_person: this.state.extra_price,
            max_people: this.state.max_people,
            beds: this.state.beds,
            bedrooms: this.state.bedrooms,
            bathrooms: this.state.bathrooms,
            rep_photo: this.state.picture,
            room_type: this.state.room_type,
            has_wifi: this.state.wifi,
            has_heating: this.state.heating,
            has_freezer: this.state.freezer,
            has_kitchen: this.state.kitchen,
            has_TV: this.state.TV,
            has_parking: this.state.parking,
            has_elevator: this.state.elevator,
            has_living_room: this.state.living_room,
            square_feet: this.state.feet,
            description: this.state.desc,
            smoking: this.state.smoking,
            pets: this.state.pets,
            events: this.state.events,
            pets: this.state.pets,
            min_nights: this.state.min_nights,
            host_id: this.props.app_state.user_primary_key,
            reserved: false
        }

        const formData = new FormData();//FormData used for the pictures.

        formData.append("name", data.name);
        formData.append("geolocation", data.geolocation);
        formData.append("street", data.street);
        formData.append("neighborhood", data.neighborhood);
        formData.append("city", data.city);
        formData.append("country", data.country);
        formData.append("transit", data.transit);
        formData.append("start_date", data.start_date);
        formData.append("end_date", data.end_date);
        formData.append("price", data.price);
        formData.append("price_per_person", data.price_per_person);
        formData.append("max_people", data.max_people);
        formData.append("beds", data.beds);
        formData.append("bedrooms", data.bedrooms);
        formData.append("bathrooms", data.bathrooms);
        formData.append("rep_photo", data.rep_photo);
        formData.append("room_type", data.room_type);
        formData.append("has_wifi", data.has_wifi);
        formData.append("has_heating", data.has_heating);
        formData.append("has_freezer", data.has_freezer);
        formData.append("has_kitchen", data.has_kitchen);
        formData.append("has_TV", data.has_TV);
        formData.append("has_parking", data.has_parking);
        formData.append("has_elevator", data.has_elevator);
        formData.append("has_living_room", data.has_living_room);
        formData.append("square_feet", data.square_feet);
        formData.append("description", data.description);
        formData.append("smoking", data.smoking);
        formData.append("pets", data.pets);
        formData.append("events", data.events);
        formData.append("minimum_nights", data.min_nights);
        formData.append("host_id", data.host_id);
        formData.append("secondary_id", 1);

        axios.post('rooms/roomList/', formData, {headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.getItem('storage_token')}`
          }}).then(response => {
              alert('Your new room has been added! You may see it in your room list.');
              
              if(this.state.files.length > 0){//Adding the images of this room.
              this.state.files.forEach(function(value, index, array) {
                const formData = new FormData();
   
                formData.append("room_id_img", response.data.pk);
                formData.append("picture", value);
                axios.post('rooms/roomImages/',formData, {headers: {
                    'Content-Type': 'application/json',
                    Authorization: `JWT ${localStorage.getItem('storage_token')}`
                  }}).then(response => {console.log('ok')}).catch(error => {console.log(error.response);})  
                })    
            }
            }).catch(error => {
                console.log(error.response);  
                alert('Some kind of error occured, please try again.')                
            })
                    
    }

    //Render function provides a link to the existing rooms, a link to the host's messages and a form to add a new room.
    render(){

        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img src={imagePreviewUrl} style={{width:500,height: 500}} />);
        }

        let {imagesPreviewUrls} = this.state;        

        let login_check = this.props.app_state.isLoggedIn;
        if (login_check){

            if(this.props.app_state.isHost){
                if(this.state.approved){ //Defining the JSX elements if the host is approved.
                    return(
                    <div>
                    <h1 className="message">You may click  <Link to={'/hostRooms/'}><span>here</span></Link> to manage your existing rooms, or </h1>
                    <h1 className="message"> You may click <Link to={'/userMessages/type=rec'}>here</Link> to check your messages, or </h1>    
                    <h1 className="message"> You may add a new room by filling in the form below: </h1>
                    <form onSubmit={this.handleFormSubmit}>
                        <h5 className="message" > Name: <input name="name" onChange={this.handleNameChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["name"]}</span>
                        <h5 className="message">Specify the geographic location of the room using the following map:</h5> 
                        <CreateMap form_state={{...this.state}}/>
                        <span style={{color: "red"}}>{this.state.errors["geolocation"]}</span>
                        <h5 className="message" > Address: <input name="address" onChange={this.handleAddressChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["street"]}</span>
                        <h5 className="message" > Neighborhood: <input name="hood" onChange={this.handleHoodChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["hood"]}</span>
                        <h5 className="message"> City: <input name="city" onChange={this.handleCityChange} /></h5>
                        <span style={{color: "red"}}>{this.state.errors["city"]}</span>
                        <h5 className="message"> Country: <input name="country" onChange={this.handleCountryChange} /></h5>
                        <span style={{color: "red"}}>{this.state.errors["country"]}</span>
                        <h5 className="message" > Transit: <input name="transit" onChange={this.handleTransitChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["transit"]}</span>
                        <h5 className="message"> Enter starting date here: <input type="date" name="start_date" onChange={this.handleStartDateChange} /></h5>
                        <span style={{color: "red"}}>{this.state.errors["s_date"]}</span>
                        <h5 className="message"> Enter ending date here: <input type="date" name="end_date" onChange={this.handleEndDateChange} /></h5>
                        <span style={{color: "red"}}>{this.state.errors["e_date"]}</span>
                        <h5 className="message" > Max number of people: <input name="max_people" onChange={this.handlePeopleChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["max_people"]}</span>
                        <h5 className="message" > Starting price: <input name="price" type="number" step="0.1" onChange={this.handlePriceChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["price"]}</span>
                        <h5 className="message" > Price per extra person: <input name="ext_price" type="number" step="0.1" onChange={this.handleExtraPriceChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["ext_price"]}</span>
                        <h5 className="message">Choose room type here:</h5> 
                        <h5 className="message">Private Room<input type="radio" value="Private room" name="room_type" checked={this.state.room_type === "Private room"} onChange={this.handleRadioChange}/>  </h5>
                        <h5 className="message">Shared Room<input type="radio" value="Shared room" name="room_type"  checked={this.state.room_type === "Shared room"} onChange={this.handleRadioChange}/> </h5>
                        <h5 className="message">Entire home/apt<input type="radio" value="Entire home/apt" name="room_type" checked={this.state.room_type === "Entire home/apt"} onChange={this.handleRadioChange} /> </h5>
                        <span style={{color: "red"}}>{this.state.errors["room_type"]}</span>
                        {$imagePreview} <br/>
                        <h5 className="message" >Choose at least one picture that represents your property: <input type="file" accept='image/*' onChange={this.handleImageChange} /> </h5> <br/>
                        <div>
                        <span style={{color: "red"}}>{this.state.errors["picture"]}</span>
                        <h5 className="message" >Add more images: </h5>
                        <input className="message" type="file" accept='image/*' onChange={this.handleMultipleImageChange} multiple/>
                        </div>
                        <h5 className="message">(Preview available at the end of the form!)</h5> 
                        <h5 className="message" > Number of beds: <input name="beds" onChange={this.handleBedsChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["beds"]}</span>
                        <h5 className="message" > Number of bedrooms: <input name="bedrooms" onChange={this.handleBedroomsChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["bedrooms"]}</span>
                        <h5 className="message" > Number of bathrooms: <input name="bathrooms" onChange={this.handleBathroomsChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["bathrooms"]}</span>
                        <h5 className="message" > Square feet: <input name="feet" type="number" step="0.1" onChange={this.handleFeetChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["feet"]}</span>
                        <h5 className="message" > Description: <textarea onChange={this.handleDescChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["desc"]}</span>
                        <h5 className="message">Amenities this room provides:</h5> 
                        <h5 className="message" > WiFi:<input type="checkbox" name="WiFi" onChange={this.handleWiFiChange}/></h5> 
                        <h5 className="message" > Freezer:<input type="checkbox" name="Freezer" onChange={this.handleFreezerChange}/></h5> 
                        <h5 className="message" > Heating:<input type="checkbox" name="Heating" onChange={this.handleHeatingChange}/></h5> 
                        <h5 className="message" > Kitchen:<input type="checkbox" name="Kitchen" onChange={this.handleKitchenChange}/></h5> 
                        <h5 className="message" > TV:<input type="checkbox" name="TV"  onChange={this.handleTVChange}/></h5> 
                        <h5 className="message" > Parking:<input type="checkbox" name="Parking" onChange={this.handleParkingChange}/></h5> 
                        <h5 className="message" > Elevator:<input type="checkbox" name="Elevator" onChange={this.handleElevatorChange}/></h5> 
                        <h5 className="message" > Living room:<input type="checkbox" name="LivingRoom" onChange={this.handleLivingRoomChange}/></h5> 
                        <h5 className="message">Specify rules:</h5> 
                        <h5 className="message" > Smoking:<input type="checkbox" name="Smoking"  onChange={this.handleSmokingChange}/></h5> 
                        <h5 className="message" > Pets:<input type="checkbox" name="Pets"  onChange={this.handlePetsChange}/></h5> 
                        <h5 className="message" > Events:<input type="checkbox" name="Events"  onChange={this.handleEventsChange}/></h5> 
                        <h5 className="message" > Minimum nights: <input name="min_nights" onChange={this.handleMinNightsChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["min_nights"]}</span> <br/>
                        <button className="apply">Add a new room</button>
                    </form>
                    {imagesPreviewUrls.length > 0 && (
                        <div>
                        <h5 className="message">Additional images here:</h5> 
                        <AwesomeSlider className='aws-btn' cssModule={AwesomeSliderStyles}>
                        {imagesPreviewUrls.map(function(imagePreviewUrl, i){
                        return <div> <img key={i} src={imagePreviewUrl} style={{width:150,height: 150}} /> <br/> </div>
                        })} 
                        </AwesomeSlider>
                        </div>)}
                    <br/>
                    <br/>
                    <br/>
                    </div>
                    )
                }else{ //Denying access to non-approved hosts.
                    return(<h1 className="message">You don't have permission to access this page yet, please be patient.</h1>)
                }
            }


        }

        if(login_check === false || !this.props.app_state.isHost){ //Denying access to non-hosts.
            return( <h1 className="message">You can't access this page!</h1>)
        }

    }

}

export default HostPage