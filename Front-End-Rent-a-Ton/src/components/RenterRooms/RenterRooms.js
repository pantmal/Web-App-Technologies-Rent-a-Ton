import React from 'react';
import {Component} from 'react';

import axios from '../AXIOS_conf'
import ReactPaginate from 'react-paginate';
import {Link} from 'react-router-dom';

//RenterRooms used for renters who want to view their resevations.
class RenterRooms extends Component{

    constructor(props){
        super(props)

        this.state = {
            offset: 0,
            users: [],
            perPage: 10,
            currentPage: 0,
            not_found: false,
            receivedData: this.receivedData()
        }

        this.handlePageClick = this.handlePageClick.bind(this);

    }

    //componentDidMount calls the receivedData() function.
    componentDidMount(){

        this.receivedData();                
    }

    //Getting the data from the server and assigning them to the current page.
    receivedData(){
        
        
            const data = {renter_id: this.props.app_state.user_primary_key}
            
            axios.post('/rooms/search/', JSON.stringify(data), {headers: { 
                'Content-Type': 'application/json'
              }})
              .then(res => {
                
                if (res.data==='not found'){ //Updating the state if there weren't any results.
                    this.setState({
                        not_found: true
                    })
                }else{
                
                const data = res.data;
                
                //Sorting the items according to their price.
                data.sort( (a, b) => parseFloat(a.total_price) - parseFloat(b.total_price) )
                
                //Getting a slice of the data according to the offset of the page we're on.
                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                //console.log(slice)

                //Now we map each room to a React Fragment so it can be rendered.
                const postData = slice.map(pd =>
                <React.Fragment>
                    <div class="grid-container">
                    <div class="grid-item2"><Link to={`/renterRooms/${pd.pk}`}><img src={"http://localhost:8000"+pd.rep_photo} style={{width:250,height: 250}} alt=""/> </Link> </div>
                    <div class="grid-item"><p className="message-grid"><Link to={`/renterRooms/${pd.pk}`}>Name: {pd.name} </Link> </p> </div>
                    <div class="grid-item"><p className="message-grid">Type: {pd.room_type}</p></div>
                    <div class="grid-item3"><p className="message-grid">Beds: {pd.beds}</p> </div>
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


    //Render function provides a link to the user's messages and the data we retrieved.
    render(){
        
        //Messages link.
        let msg_link = <h1 className="message">Click <Link to={'/userMessages/type=rec'}>here</Link> to check your messages.</h1> 

        //No results message.
        let not_found_msg = <div> <h1 className="message">Sorry, nothing found.</h1>
        <button className="apply" onClick={this.props.history.goBack}>Go Back</button>
        </div>

        let login_check = this.props.app_state.isLoggedIn;
        if (login_check){
            if(this.props.app_state.isRenter){
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
                    
                    //Returing the JSX elements.
                    return(
                        <div>
                            {msg_link}
                            {paginate}
                            {this.state.postData}
                            {paginate}
                        </div>
                    )
                }else{

                    //Returing the JSX elements.
                    return(
                        <div>
                        {msg_link}
                        {not_found_msg}
                        </div>
                    )
                }

            }
        }

        if(login_check === false || !this.props.app_state.isRenter){ //Only renters may access this page.
            return( <h1 className="message">You can't access this page!</h1>)
        }

    }

}

export default RenterRooms
