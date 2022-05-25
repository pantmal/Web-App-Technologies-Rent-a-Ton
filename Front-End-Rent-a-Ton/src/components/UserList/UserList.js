import React from 'react';
import {Component} from 'react';

import ReactPaginate from 'react-paginate';
import {Link} from 'react-router-dom';

import axios from '../AXIOS_conf'

import './userList.css'

//UseList component so an Admin may navigate each user.
class UserList extends Component{


    constructor(props) {
        super(props);
        this.state = {
            offset: 0,
            users: [],
            perPage: 10,
            currentPage: 0,
            receivedData: this.receivedData
        };

        
        this.handlePageClick = this.handlePageClick.bind(this);
    }

    //componentDidMount calls the receivedData() function.
    componentDidMount() {
        this.receivedData()
    }

    //Getting the data from the server and assigning them to the current page.
    receivedData() {
        axios.get('users/userList/')
            .then(res => {

                //check results if picture is null
                const data = res.data;
                console.log(data)
                //Getting a slice of the data according to the offset of the page we're on.
                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)

                //Now we map each user to a React Fragment so it can be rendered.
                const postData = slice.map(pd =>
                <React.Fragment>
                    <div class="grid-container">
                    <div class="grid-item2"><Link to={`/userList/${pd.pk}`}><img src={pd.picture} style={{width:250,height: 250}} alt=""/> </Link> <br/></div>
                    <div class="grid-item3"><p className="message-grid"><Link to={`/userList/${pd.pk}`}> Username: {pd.username} </Link> </p></div>
                    <div class="grid-item"><p className="message-grid">Fist name: {pd.first_name}</p></div>
                    <div class="grid-item"><p className="message-grid">Last name: {pd.last_name}</p></div>
                    <div class="grid-item"><p className="message-grid"> Admin: {pd.is_staff ? '\u2705':'\u274c'}</p></div>
                    <div class="grid-item"><p className="message-grid"> Host: {pd.is_host ? '\u2705':'\u274c'}</p></div>
                    <div class="grid-item"><p className="message-grid"> Renter: {pd.is_renter ? '\u2705':'\u274c'}</p></div>
                    <div class="grid-item"><p className="message-grid"> Approved: {pd.approved ? '\u2705':'\u274c'}</p></div>
                    </div>
                    <hr/> 
                </React.Fragment>)

                this.setState({ //Updating the state with our room data to be displayed.
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    postData
                })
            });
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

    
    //Render function displays the users returned.
    render(){

        let permission = false
        
        let login_check = this.props.app_state.isLoggedIn;
        if (login_check){
            if (this.props.app_state.isAdmin){
             permission = true
            }
        }

        
        if (!permission){ //Denying access to non-admins.
            return(
                <h1 className="message">You can't access this page!</h1>
            )
        }else{

            let nav = <h1 className="message"> Click on one of the users to get the detailed information:</h1> 

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
            
            
            //Returning the paginated data.
            return (
                <div>
                    {nav}
                    {paginate}
                    {this.state.postData}
                    {paginate}
                </div>
    
            )
        }

        
    }

}

export default UserList