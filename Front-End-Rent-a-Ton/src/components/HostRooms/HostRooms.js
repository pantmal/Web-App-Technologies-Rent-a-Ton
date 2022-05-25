import React from 'react';
import {Component} from 'react';

import axios from '../AXIOS_conf'
import ReactPaginate from 'react-paginate';
import {Link} from 'react-router-dom';

import './grid.css'

//HostRooms component used for the rooms that belong to the host.
class HostRooms extends Component{

    constructor(props){
        super(props)

        this.state = {
            approved: false,
            offset: 0,
            users: [],
            perPage: 10,
            currentPage: 0,
            not_found: false,
            receivedData: this.receivedData()
        }

        this.handlePageClick = this.handlePageClick.bind(this);

    }

    //When the component mounts we get the details of the user that is viewing the page.
    componentDidMount(){
        
        const id = this.props.app_state.user_primary_key
        axios.get(`users/userList/${id}`/*,
      {
        headers: {
          Authorization: `JWT ${localStorage.getItem('storage_token')}`
        }}*/).then(response => { const user = response.data;
            console.log(user);
          this.setState({
            approved: user.approved
          });

          //If the host is approved, call receivedData()
          this.receivedData();
        }).catch(error => {console.log(error.response);})


    }

    //Getting the data from the server and assigning them to the current page.
    receivedData(){
        
        const data = {host_id: this.props.app_state.user_primary_key}
        
        axios.post('/rooms/search/', JSON.stringify(data), {headers: { 
            'Content-Type': 'application/json'
            }})
            .then(res => {
            
            if (res.data==='not found'){ //Updating the state if there weren't any results.
                this.setState({
                    not_found: true
                })
            }else{
            

            //check results if picture is null
            const data = res.data;
            
            //Adding an extra total_price field according to the max people this room accomodates.
            const price_data = data.map(d =>
                ({ ...d,
                total_price: d.price + ((d.max_people-1) * d.price_per_person)})
                )
            
            //Sorting the items according to their price.
            price_data.sort( (a, b) => parseFloat(a.total_price) - parseFloat(b.total_price) )
            //console.log(price_data)

            //Getting a slice of the data according to the offset of the page we're on.
            const slice = price_data.slice(this.state.offset, this.state.offset + this.state.perPage)
            //console.log(slice)

            //Now we map each room to a React Fragment so it can be rendered.
            const postData = slice.map(pd =>
                
            <React.Fragment>
                <div class="grid-container">
                <div class="grid-item2"><Link to={`/hostRooms/${pd.pk}`}><img src={"http://localhost:8000"+pd.rep_photo} style={{width:250,height: 250}} alt=""/> </Link></div>
                <div class="grid-item"><p className="message-grid"> <Link to={`/hostRooms/${pd.pk}`}> Name: {pd.name}</Link> </p> </div>
                <div class="grid-item"> <p className="message-grid">Price: {pd.total_price}</p> </div>
                <div class="grid-item"> <p className="message-grid">Type: {pd.room_type}</p> </div>
                <div class="grid-item"> <p className="message-grid">Beds: {pd.beds}</p> </div>
                </div>
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


    //Render function displays the rooms returned.
    render(){
        let not_found_msg = <div> <h1 className="message">Sorry, nothing found.</h1>
        <button className="apply" onClick={this.props.history.goBack}>Go Back</button>
        </div>

        let login_check = this.props.app_state.isLoggedIn;
        if (login_check){

            if(this.props.app_state.isHost){
                if(this.state.approved){

                    if (this.state.not_found === false){
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

                    return(
                        <div>
                            <h1 className="message">Click on one of the rooms to get its detailed infromation.</h1>
                            {paginate}
                            {this.state.postData}
                            {paginate}
                        </div>
                    )
                }else{ //Displaying the necessary message if there weren't any rooms returned.
                    return(
                        <div>
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


export default HostRooms
