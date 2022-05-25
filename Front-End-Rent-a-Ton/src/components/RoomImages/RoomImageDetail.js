import React from 'react';
import {Component} from 'react';

import axios from '../AXIOS_conf'

//RoomImageDetail is used when the user examines one Room Image.
class RoomImageDetail extends Component{

    constructor(props){//Constructor function.
        super(props)

        this.state = {
            pk: '',
            room_id: '',
            picture: '',
            imagePreviewUrl:'',
            host_id: '',
            approval: false
        }

        this.handleUpdate = this.handleUpdate.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleImageChange = this.handleImageChange.bind(this)
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
           if(this.state.approved){ //If he is an approved host, get the Room Image item from the server.
            const {id} = this.props.match.params
            axios.get(`rooms/roomImages/${id}`/*, {
                headers: {
                  Authorization: `JWT ${localStorage.getItem('storage_token')}`
                }}*/).then( 
                    response => {

                    //Update the state
                    const res_image = response.data
                    this.setState({
                        pk: res_image.pk,
                        room_id: res_image.room_id_img,
                        picture: res_image.picture,
                        imagePreviewUrl: res_image.picture
                    })

                    //Get the Room Item this image belongs to.
                    axios.get(`rooms/roomList/${this.state.room_id}`/*, {
                        headers: {
                          Authorization: `JWT ${localStorage.getItem('storage_token')}`
                        }}*/).then( 
                        response => {
                        
                        //Getting the host id who has this room.
                        const res_room = response.data
                        this.setState({
                            host_id: res_room.host_id
                        })
    
                        //If the room doesn't belong to the host viewing the page, he may not access this Room Image page.
                        if(this.state.host_id != this.props.app_state.user_primary_key){
                            alert('You can only edit your own images!')
                            this.props.history.push("/")
                        }
                    }
                )

                }
            )
           }   
        }).catch(error => {console.log(error.response);})
        
        
    }

    //Updating the Image with FileReader()
    handleImageChange = (event) => {
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

    //Updating this image data on the database.
    handleUpdate = event =>{

        const data = {
            room_id_img: this.state.room_id,
            picture: this.state.picture
        }

        const formData = new FormData();

        formData.append("room_id_img", data.room_id_img);
        formData.append("picture", data.picture);

        axios.patch(`rooms/roomImages/${this.state.pk}/`, formData, {headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.getItem('storage_token')}`
          }}).then(response => {alert('Your image has been updated.');  
            }).catch(error => {
                console.log(error.response);   
                alert('Some kind of error occured, please try again.')
            })

    }

    //Deleting this image from the database.
    handleDelete = event =>{

        axios.delete(`rooms/roomImages/${this.state.pk}/`, {headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.getItem('storage_token')}`
          }}).then(response => {alert('Your image has been deleted.');  
            this.props.history.push(`/roomImages/${this.state.room_id}`)
            }).catch(error => {
                console.log(error.response);   
                alert('Some kind of error occured, please try again.')
            })

    }
    
    //Render function previews the image and includes and Update and Delete button.
    render(){

        //If imagePreviewUrl is not null, update the $imagePreview variable with the image data.
        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img src={imagePreviewUrl} style={{width:500,height: 500}} />);
        }

        let permission = false
        
        let login_check = this.props.app_state.isLoggedIn;
        if (login_check){ 
            if (this.props.app_state.isHost){
             permission = true
            }
        }
        
        if (!permission){ //Denying access to non-hosts.
            return(
                <h1 className="message">You can't access this page!</h1>
            )
        }else{ //Rendering the page.
            if(this.state.approved){ //If the host is approved return the necessary elements.
                return(
                    <div>
                        {$imagePreview} <br/>
                        <h5 className="message" >Choose a new picture: <input type="file" accept='image/*' onChange={this.handleImageChange} /> </h5> <br/>
                        <button className="apply" onClick={this.handleUpdate}>Update this image</button>
                        <button className="apply" onClick={this.handleDelete}>Delete this image</button>
                    </div>
                )
            }else{ //Denying access to non-approved hosts.
                return(<h1 className="message">You don't have permission to access this page yet, please be patient.</h1>)
            }
        }
    }
}

export default RoomImageDetail