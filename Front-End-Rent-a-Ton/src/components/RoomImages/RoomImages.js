import React from 'react';
import {Component} from 'react';
import {Link} from 'react-router-dom';

import axios from '../AXIOS_conf'
import ReactPaginate from 'react-paginate';

//RoomImages component so a host can handle the additional images for one of his rooms.
class RoomImages extends Component{

    constructor(props){
        super(props)

        this.state = {
            approved: false,
            not_found: false,
            room_id: '',
            offset: 0,
            users: [],
            perPage: 10,
            currentPage: 0,
            host_id: '',
            files: [],
            imagesPreviewUrls: [],
            receivedData: this.receivedData()
        }

        this.handlePageClick = this.handlePageClick.bind(this);
        this.handleMultipleImageChange = this.handleMultipleImageChange.bind(this)
        this.handleNewImages = this.handleNewImages.bind(this);
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
           if(this.state.approved){ //If he is an approved host, get the Room item from the server.
            const {id} = this.props.match.params
            axios.get(`rooms/roomList/${id}`/*, {
                headers: {
                  Authorization: `JWT ${localStorage.getItem('storage_token')}`
                }}*/).then( 
                    response => {

                    //Getting the room's data
                    const res_room = response.data
                    this.setState({
                        room_id: res_room.pk,
                        host_id: res_room.host_id
                    })

                    //If the room doesn't belong to the host viewing the page, he may not access this page.
                    if(this.state.host_id != this.props.app_state.user_primary_key){
                        alert('You can only edit your own images!')
                        this.props.history.push("/")
                    }

                    //Now getting the Room Images data.
                    this.receivedData()
                }
            )
           }   
        }).catch(error => {console.log(error.response);})
                
    }

    //Getting the data from the server and assigning them to the current page.
    receivedData(){
        
        const id = this.props.match.params.id
        const data = {room_id_img: id}
            
        axios.post('/rooms/getImages/', JSON.stringify(data), {headers: { 
            'Content-Type': 'application/json'
            }})
            .then(res => {
            
                if (res.data==='not found'){ //Updating the state if there weren't any results.
                    this.setState({
                        not_found: true
                    })
                }else{

                    const data = res.data;

                    //Getting a slice of the data according to the offset of the page we're on.
                    const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    //console.log(slice)

                    //Now we map each image to a React Fragment so it can be rendered.
                    const postData = slice.map(pd =>
                    <React.Fragment>
                        <Link to={`/roomImageDetail/${pd.pk}`}><img src={"http://localhost:8000"+pd.picture} style={{width:250,height: 250}} alt=""/> </Link>
                        <hr/>
                    </React.Fragment>)

                    this.setState({ //Updating the state with our room data to be displayed.
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        postData
                    })
                
                }
        })
        

    }

    //Handling a new page change by updating the current page, the offset and calling the receivedData() function to get data for the new page.
    handlePageClick = (event) => {
        const selectedPage = event.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset,
            receivedData: this.receivedData()
        });

    };

    //Handling each image added by the user with FileReader.
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

    //Adding the images selected by the user to the server.
    handleNewImages = event => {
        let room_id = this.state.room_id
        
        if(this.state.files.length > 0){
            this.state.files.forEach(function(value, index, array) {
              const formData = new FormData();
 
              formData.append("room_id_img", room_id);
              formData.append("picture", value);
              axios.post('rooms/roomImages/',formData, {headers: {
                  'Content-Type': 'application/json',
                  Authorization: `JWT ${localStorage.getItem('storage_token')}`
                }}).then(response => {console.log('ok');
                }).catch(error => {console.log(error.response);})  
              })
            alert('Your new images have been added successfully. Refresh the page to see them on the list.')      
          }
    }

    //Render function displays a button so a user may add new images and navigate to an existing image.
    render(){

        //Defining a message if there weren't any results.
        let not_found_msg = <div> <h1 className="message">Sorry, nothing found.</h1>
        <button className="apply" onClick={this.props.history.goBack}>Go Back</button>
        </div>

        //Message for navigation.
        let nav = <h1 className="message">Click on the existing images to either update them, or delete them.</h1>

        let {imagesPreviewUrls} = this.state;        

        let login_check = this.props.app_state.isLoggedIn;
        if (login_check){
            if(this.props.app_state.isHost){
                if(this.state.approved){ //If the host is approved define the necessary elements.

                    //Adding photos element.
                    let add_photos = <div><h5 className="message" >Add more images: </h5>
                    <input className="message" type="file" accept='image/*' onChange={this.handleMultipleImageChange} multiple/>
                    {imagesPreviewUrls.map(function(imagePreviewUrl, i){
                        return <div> <img key={i} src={imagePreviewUrl} style={{width:100,height: 100}} /> <br/> </div>
                        })}
                    <button className="apply" onClick={this.handleNewImages}>Post new images</button>
                    </div>

                    if (this.state.not_found === false){

                        //Defining the pagination component.
                        let paginate = 
                    
                        <ReactPaginate
                            previousLabel={"Previous"}
                            nextLabel={"Next"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={this.state.pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handlePageClick}
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"}
                            forcePage={this.state.currentPage}
                        />

                        //Returning the images.
                        return(
                            <div>
                                {add_photos}
                                {nav}    
                                {paginate}
                                {this.state.postData}
                                {paginate}
                            </div>
                        )
                    }else{//Returning 'not found' message.
                        return(
                            <div>
                            {add_photos}
                            {not_found_msg}
                            </div>
                        )
                    }
                    
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

export default RoomImages