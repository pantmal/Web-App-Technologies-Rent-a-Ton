import React from 'react';
import {Component} from 'react';
import {Link} from 'react-router-dom';
import ReactStars from "react-rating-stars-component";
import AwesomeSlider from "react-awesome-slider";
import AwesomeSliderStyles from 'react-awesome-slider/src/styles';

import axios from '../AXIOS_conf'

import ViewMap from './ViewMap.js'

import './stars.css'

//RenterRoomDetail so a renter may see a room and make a reservation and/or add ratings. Also used for visitors, though they can only view the room.
class RenterRoomDetail extends Component{

    constructor(props){
        super(props)

        let date_mode = false
    
        //If there are dates in the URL we are in date_mode. This means later on we will check if a renter can make a reservation on the specified dates.
        let query = this.props.match.params
        let start_date = '';
        let end_date = '';
        if (query.parameters!=null){
            date_mode = true
        
            let split_params = query.parameters.split('&')
            let s_date_param = split_params[0]
            let e_date_param = split_params[1]

            let s_date_param_med = s_date_param.split('=')
            start_date = s_date_param_med[1]

            let e_date_param_med = e_date_param.split('=')
            end_date = e_date_param_med[1]

        }

        this.state = {
            count:'',
            avg:'',
            h_count:'',
            h_avg:'',
            approved: false,
            date_mode: date_mode,
            date_free: false,
            start_date: start_date,
            end_date: end_date,
            can_review: false,
            room_id: '',
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
            host_id:'',
            lat: '',
            lng: '',
            files: [],
            imagesPreviewUrls: [],
            host_username:'' ,
            host_picture:'' ,
            host_email:'' ,
        }

        this.handleRentChange = this.handleRentChange.bind(this)
        this.roomRatingChanged = this.roomRatingChanged.bind(this)
        this.hostRatingChanged = this.hostRatingChanged.bind(this)
    }


    componentDidMount(){

        //Getting the room from the database.
        const {id} = this.props.match.params
        axios.get(`rooms/roomList/${id}`/*, {
            headers: {
                Authorization: `JWT ${localStorage.getItem('storage_token')}`
            }}*/).then( 
                response => {
                const res_room = response.data
                this.setState({
                    room_id: res_room.pk,
                    name: res_room.name,
                    street: res_room.street,
                    hood: res_room.neighborhood,
                    city: res_room.city,
                    country: res_room.country,
                    transit: res_room.transit,
                    s_date: res_room.start_date,
                    e_date: res_room.end_date,
                    price: res_room.price,
                    extra_price: res_room.price_per_person,
                    max_people: res_room.max_people,
                    beds: res_room.beds,
                    bedrooms: res_room.bedrooms,
                    bathrooms: res_room.bathrooms,
                    picture: res_room.rep_photo,
                    imagePreviewUrl: res_room.rep_photo,
                    room_type: res_room.room_type,
                    wifi: res_room.has_wifi,
                    heating: res_room.has_heating,
                    freezer: res_room.has_freezer,
                    kitchen: res_room.has_kitchen,
                    TV: res_room.has_TV,
                    parking: res_room.has_parking,
                    elevator: res_room.has_elevator,
                    living_room: res_room.has_living_room,
                    feet: res_room.square_feet,
                    desc: res_room.description,
                    smoking: res_room.smoking,
                    pets: res_room.pets,
                    events: res_room.events,
                    min_nights: res_room.minimum_nights,
                    host_id: res_room.host_id
                })

                //Getting the geographical location.
                let location = res_room.geolocation.split(' ')
                let lng = location[1].replace('(','')
                let lat = location[2].replace(')','')
                this.setState({
                    lat: lat,
                    lng: lng
                })

                //Now getting its images.
                const data = {room_id_img: this.state.room_id}
        
                axios.post('/rooms/getImages/', JSON.stringify(data), {headers: { 
                    'Content-Type': 'application/json'
                }})
                .then(res => {

                    if (res.data!=='not found'){ //Making sure this room has additional images.

                        let new_arr = []
                        res.data.forEach(function(value, index, array) {
                            
                            new_arr.push("http://localhost:8000"+value.picture)
                            
                        })
                            
                        this.setState({ //Updating the state with the images we got.
                            files: new_arr,
                            imagesPreviewUrls: new_arr
                        })
                    }
                })

                //Getting the host's data.
                const id = this.state.host_id
                axios.get(`users/userList/${id}`/*, {
                    headers: {
                    Authorization: `JWT ${localStorage.getItem('storage_token')}`
                    }}*/).then( 
                    response => {
                        const res_user = response.data
                        this.setState({
                            host_username: res_user.username,
                            host_picture: res_user.picture,
                            host_email: res_user.email
                        })
                    }
                )

                //If the user is both a host and renter, make sure he can't make a reservation on one of his own rooms.
                if(this.props.app_state.isHost && this.props.app_state.isRenter && this.state.date_mode===true){
                    if (this.state.host_id == this.props.app_state.user_primary_key){
                        alert('You can\'t make a reservation on your own rooms.')
                        this.props.history.push("/")
                    }
                }

                //If we're clicking this room for the first time, add its id in the server for future recommendations.
                if(this.props.app_state.isRenter && this.state.date_mode===true){
                    
                    const formData = new FormData();
                    formData.append("click", 'click');
                    formData.append("room_id_click", this.state.room_id);
                    formData.append("renter_id_click", this.props.app_state.user_primary_key);
                    axios.post('rooms/addSearchesClicks/',formData, {headers: {
                    'Content-Type': 'application/json',
                    Authorization: `JWT ${localStorage.getItem('storage_token')}`
                    }}).then(response => {console.log('click ok')}).catch(error => {console.log(error.response);})

                }

                //If we're in date mode, check if we can make a reservation and update the state.
                if (this.state.date_mode){

                    const dateData = new FormData();
                    dateData.append("room_id", this.state.room_id);
                    dateData.append("start_date", this.state.start_date);
                    dateData.append("end_date", this.state.end_date);

                    axios.post('rooms/resCheck/',dateData, {headers: {
                    'Content-Type': 'application/json'
                    }}).then(response => {console.log(response.data)
                        if(response.data==='free'){
                            this.setState({
                                date_free: true
                            })
                        }else{
                            this.setState({
                                date_free: false
                            })
                        }
                    }).catch(error => {console.log(error.response);})
                }

                //Check if a renter can leave ratings.
                if(this.props.app_state.user_primary_key != -1){

                    let date = new Date();
                    let year = date.getFullYear()
                    let month = date.getMonth()+1
                    let day = date.getDate()

                    let date_now = `${year}-${month}-${day}`

                    const dateData = new FormData();
                    dateData.append("room_id", this.state.room_id);
                    dateData.append("user_id", this.props.app_state.user_primary_key);
                    dateData.append("date_now", date_now);

                    axios.post('rooms/ratCheck/',dateData, {headers: {
                        'Content-Type': 'application/json'
                        }}).then(response => {console.log(response.data)
                            if(response.data==='free'){
                                this.setState({
                                    can_review: true
                                })
                            }else{
                                this.setState({
                                    can_review: false
                                })
                            }
                        }).catch(error => {console.log(error.response);})

                }

                //Getting room ratings count and average number.
                const revData = new FormData();    
                revData.append("room", 'room');
                revData.append("room_id", this.state.room_id);
                
                axios.post('rooms/ratCount/',revData, {headers: {
                        'Content-Type': 'application/json'
                }}).then(response => {
                    //console.log(response.data)
                    this.setState({
                        count: response.data.count,
                        avg: response.data.avg.rating__avg
                    })  
                }).catch(error => {console.log(error.response);})

                //Getting host ratings count and average number.
                const hostData = new FormData();    
                hostData.append("host", 'host');
                hostData.append("host_id", this.state.host_id);
                
                axios.post('rooms/ratCount/',hostData, {headers: {
                        'Content-Type': 'application/json'
                }}).then(response => {
                console.log(response.data)
                this.setState({
                    h_count: response.data.count,
                    h_avg: parseFloat(response.data.avg.rating__avg)
                })  
                }).catch(error => {console.log(error.response);})
                    
            }
        )

    }

    //Adding a reservation item in the server.
    handleRentChange = event =>{
        
        const resData = new FormData();
        resData.append("room_id_res", this.state.room_id);
        resData.append("renter_id_res", this.props.app_state.user_primary_key);
        resData.append("start_date", this.state.start_date);
        resData.append("end_date", this.state.end_date);


        axios.post('rooms/reservations/',resData, {headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${localStorage.getItem('storage_token')}`
        }}).then(response => {console.log(response.data)
            this.setState({
                date_free: false
            })

            //Displaying a message with the dates reserved and reloading the page.
            alert(`You have successfully rented the current room from ${this.state.start_date} to ${this.state.start_date}.\n You may see your reservations at the reservation list in the home page and click on their details to contact the host for more information.`)
            window.location.reload();
        }).catch(error => {console.log(error.response);})
    }

    //Adding a room rating in the database.
    roomRatingChanged = (newRating) => {

        let date = new Date();
        let year = date.getFullYear()
        let month = date.getMonth()+1
        let day = date.getDate()

        let date_now = `${year}-${month}-${day}`


        const rateData = new FormData();
        rateData.append("room_id_rate", this.state.room_id);
        rateData.append("renter_id_rate", this.props.app_state.user_primary_key);
        rateData.append("date", date_now);
        rateData.append("rating", newRating);
        rateData.append("secondary_id", '1');
        
        axios.post('rooms/roomRatings/',rateData, {headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.getItem('storage_token')}`
            }}).then(response => {console.log(response.data)
                alert('Your rating for this room has been recorded.')
            }).catch(error => {console.log(error.response);})
    };

    //Adding a host rating in the database.
    hostRatingChanged = (newRating) => {

        let date = new Date();
        let year = date.getFullYear()
        let month = date.getMonth()+1
        let day = date.getDate()

        let date_now = `${year}-${month}-${day}`

        const rateData = new FormData();
        rateData.append("host_id_hostRate", this.state.host_id);
        rateData.append("renter_id_hostRate", this.props.app_state.user_primary_key);
        rateData.append("date", date_now);
        rateData.append("rating", newRating);
        
        axios.post('rooms/hostRatings/',rateData, {headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.getItem('storage_token')}`
            }}).then(response => {console.log(response.data)
                alert('Your rating for this host has been recorded.')
            }).catch(error => {console.log(error.response);})
    };

    //Render function displays all the necessary data.
    render(){

        //Defining images previews.
        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img src={imagePreviewUrl} style={{width:500,height: 500}} />);
        }
        
        let {imagesPreviewUrls} = this.state;     
        
        //Defining a reservation button.
        let button_obj
        if (this.state.date_mode && this.state.date_free && this.props.app_state.isRenter){
            button_obj = <button className="apply" onClick={this.handleRentChange}>Make a reservation!</button>
        }

        //Defining rating-related elements.
        let review_stuff
        if (this.state.can_review && this.props.app_state.isRenter){
            review_stuff = 
            <div>
                <h5 className="message"> Looks like you have rented this room in the past. Would you like to leave a rating?</h5> 
                <div className='stars'>
                <ReactStars className = {'stars'}
                count={5}
                onChange={this.roomRatingChanged}
                size={24}
                isHalf={true}
                emptyIcon={<i className="far fa-star"></i>}
                halfIcon={<i className="fa fa-star-half-alt"></i>}
                fullIcon={<i className="fa fa-star"></i>}
                activeColor="#ffd700"
                />
                </div>
                <h5 className="message"> You may also rate the host here:</h5> 
                <div className='stars'>
                <ReactStars 
                count={5}
                onChange={this.hostRatingChanged}
                size={24}
                isHalf={true}
                emptyIcon={<i className="far fa-star"></i>}
                halfIcon={<i className="fa fa-star-half-alt"></i>}
                fullIcon={<i className="fa fa-star"></i>}
                activeColor="#ffd700"
                />
                </div>
            </div>
            
        }

        //Displaying the room's data.
        if(this.props.app_state.isRenter || !this.props.app_state.isLoggedIn){
                return(
                <div>
                <h5 className="message"> Room information:</h5> 
                <h5 className="message" > Name: {this.state.name} </h5> 
                <h5 className="message" > Room type: {this.state.room_type} </h5> 
                <h5 className="message" > Number of beds: {this.state.beds} </h5> 
                <h5 className="message" > Number of bedrooms: {this.state.bedrooms} </h5> 
                <h5 className="message" > Number of bathrooms: {this.state.bathrooms} </h5>     
                <h5 className="message" > Living room: {this.state.living_room ? '\u2705':'\u274c' } </h5>
                <h5 className="message" > Square feet: {this.state.feet}</h5>     
                <br/>
                <h5 className="message" > Description: {this.state.desc} </h5>    
                <br/>
                <h5 className="message"> Rules:</h5> 
                <h5 className="message" > Smoking: {this.state.smoking ? '\u2705':'\u274c' } </h5>
                <h5 className="message" > Pets: {this.state.pets ? '\u2705':'\u274c' } </h5>
                <h5 className="message" > Events: {this.state.events ? '\u2705':'\u274c' } </h5>
                <h5 className="message" > Minimum nights: {this.state.min_nights}</h5>     
                <br/>
                <h5 className="message"> Location:</h5> 
                <h5 className="message"> Move the mouse on the map to see the location of this room:</h5> 
                <ViewMap form_state={{...this.state}}/>
                <h5 className="message"> Address: {this.state.street} </h5> 
                <h5 className="message" > Neighborhood: {this.state.hood} </h5> 
                <h5 className="message"> City: {this.state.city} </h5>
                <h5 className="message"> Country: {this.state.country}</h5>
                <h5 className="message" > Transit: {this.state.transit}</h5> 
                <br/>
                <h5 className="message"> Price:</h5> 
                <h5 className="message" > Starting price: {this.state.price} </h5> 
                <h5 className="message" > Price per extra person: {this.state.extra_price}</h5> 
                <br/>
                <h5 className="message"> Main photograph:</h5> 
                {$imagePreview} <br/>

                {imagesPreviewUrls.length > 0 && (    
                <h5 className="message"> Check out more images:</h5> 
                )}
                {imagesPreviewUrls.length > 0 && (
                <AwesomeSlider className='aws-btn' cssModule={AwesomeSliderStyles}>
                {imagesPreviewUrls.map(function(imagePreviewUrl, i){
                        return <div> <img key={i} src={imagePreviewUrl} style={{width:150,height: 150}} alt='' /> </div>
                })}
                </AwesomeSlider>)}
                <br/>
                <br/>
                <h5 className="message">Amenities this room provides:</h5> 
                <h5 className="message" > WiFi: {this.state.wifi ? '\u2705':'\u274c' } </h5> 
                <h5 className="message" > Freezer: {this.state.freezer ? '\u2705':'\u274c' }</h5> 
                <h5 className="message" > Heating: {this.state.heating ? '\u2705':'\u274c' }</h5> 
                <h5 className="message" > Kitchen: {this.state.kitchen ? '\u2705':'\u274c' }</h5> 
                <h5 className="message" > TV: {this.state.TV ? '\u2705':'\u274c' }</h5> 
                <h5 className="message" > Parking: {this.state.parking ? '\u2705':'\u274c' }</h5> 
                <h5 className="message" > Elevator: {this.state.elevator ? '\u2705':'\u274c' }</h5> 
                <br/>
                <h5 className="message">Average number of ratings: {this.state.avg} (out of 5 stars) </h5>
                <h5 className="message">Total number of ratings: {this.state.count} </h5>
                <br/>
                <h5 className="message">Host information (click on the host to contact him!):</h5> 
                <h5 className="message" ><Link to={`/createMessage/${this.state.host_id}`}>  Host name: {this.state.host_username} </Link></h5>
                <h5 className="message" ><Link to={`/createMessage/${this.state.host_id}`}>  Host picture: <img src={this.state.host_picture} style={{width:100,height: 100}}/> </Link></h5>
                <h5 className="message">Average number of ratings: {this.state.h_avg} (out of 5 stars) </h5>
                <h5 className="message">Total number of ratings: {this.state.h_count} </h5>
                
                {button_obj}
                <br/>
                {review_stuff}
                </div>
                )
            }else{ //Only renters and visitors may access this page.
                return( <h1 className="message">You can't access this page!</h1>)
            }
    
    }

}

export default RenterRoomDetail