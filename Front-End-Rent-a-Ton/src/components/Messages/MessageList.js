import React from 'react';
import {Component} from 'react';

import ReactPaginate from 'react-paginate';
import {Link} from 'react-router-dom';

import axios from '../AXIOS_conf'

import './message-grid.css'

//MessageList component so a user may see his list of messages, sent and received.
class MessageList extends Component{


    constructor(props) {
        super(props);

        let sender_mode = false
        
        //Setting the viewmode depending on the type specified on the URL.
        let query = this.props.match.params
        if (query.parameters!=null){
            
            let split_params = query.parameters.split('=')
            if(split_params[1]==='sent'){
                sender_mode = true
            }else{
                sender_mode = false
            }
        }


        this.state = {
            sender_mode: sender_mode,
            not_found: false,
            username: '',
            offset: 0,
            users: [],
            perPage: 10,
            currentPage: 0,
            receivedData: this.receivedData
        };

        
        this.handlePageClick = this.handlePageClick.bind(this);
        this.handleSentButton = this.handleSentButton.bind(this);
        this.handleReceivedButton = this.handleReceivedButton.bind(this);
    }

    //Getting the message data from the server and assigning them to the current page.
    receivedData() {


        let data
        if(this.state.sender_mode){
            
            //Getting the messages by the type we need.
            data = {
                type: 'sent',
                id: this.props.app_state.user_primary_key
            }

            axios.post(
                'users/getMessages/', JSON.stringify(data), {headers: {
                    'Content-Type': 'application/json',
                    Authorization: `JWT ${localStorage.getItem('storage_token')}`
                }}
            ).then( response => {
                if (response.data==='not found'){ //Updating the state if there weren't any results.
                    this.setState({
                        not_found: true
                    })
                }else{

                    const data = response.data;

                    //Sorting messages by date
                    data.sort(function(a,b){
                        return new Date(b.date) - new Date(a.date);
                    });
                    
                    //Getting a slice of the data according to the offset of the page we're on.
                    const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)    
                
                    //Now we map each message to a React Fragment so it can be rendered.
                    const postData = slice.map(pd =>
                    <React.Fragment>
                        <div class="grid-container-msg">
                        <div class="grid-item-msg"><p className="message-grid"><Link to={`/userMessageDetail/${pd.pk}`}> Title: {pd.title} </Link> </p></div>
                        <div class="grid-item-msg"><p className="message-grid">Sent to: {pd.receiver_name}</p></div>
                        <div class="grid-item-msg"><p className="message-grid">Date: {pd.date}</p></div>
                        </div>
                        <hr/> 
                    </React.Fragment>)
    
                    //Updating the state with our message data to be displayed.
                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        postData
                    })
                }
            }).catch(error => {
                console.log(error.response)
                alert('Some kind of error occured...')
            })
        }else{ //Same work but for received messages.
            data = {
                type: 'rec',
                id: this.props.app_state.user_primary_key
            }
            axios.post(
                'users/getMessages/', JSON.stringify(data), {headers: {
                    'Content-Type': 'application/json',
                    Authorization: `JWT ${localStorage.getItem('storage_token')}`
                }}
            ).then( response => {
                if (response.data==='not found'){
                    this.setState({
                        not_found: true
                    })
                }else{
                    const data = response.data;

                    //Sorting messages by date
                    data.sort(function(a,b){
                        return new Date(b.date) - new Date(a.date);
                    });

                    const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    const postData = slice.map(pd =>
                    <React.Fragment>
                        <div class="grid-container-msg">
                        <div class="grid-item-msg"><p className="message-grid"><Link to={`/userMessageDetail/${pd.pk}`}> Title: {pd.title}</Link> </p></div>
                        <div class="grid-item-msg"><p className="message-grid"> Sent by: {pd.sender_name}</p> </div>
                        <div class="grid-item-msg"><p className="message-grid"> Date: {pd.date}</p> </div>
                        </div>
                        <hr/> 
                    </React.Fragment>)
    
                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        postData
                    })
                }
            }).catch(error => {
                console.log(error.response)
                alert('Some kind of error occured...')
            })
        }


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

    //componentDidMount calls the receivedData() function.
    componentDidMount() {
        this.receivedData()
    }

    //Used so we can navigate to the sent messages.
    handleSentButton = event =>{
        this.props.history.push({pathname:'/userMessages/type=sent'})
        window.location.reload();
    }

    //Used so we can navigate to the received messages.
    handleReceivedButton = event =>{
        this.props.history.push({pathname:'/userMessages/type=rec'})
        window.location.reload();
    }
    
    //Render function provides a link so a user can create a new message, two buttons so he can switch between sent and received messages and messages we got.
    render(){

        if(this.props.app_state.isRenter || this.props.app_state.isHost){

            let create_str = <h1 className="message">You may click <Link to={'/createMessage/'}><span>here</span></Link> to create a new message. </h1>
            let sent = <button className="apply" onClick={this.handleSentButton}>Go to Sent messages</button>
            let received = <button className="apply" onClick={this.handleReceivedButton}>Go to Received messages</button>

            let not_found_msg 
            let paginate 
            let results
            let type
            let view_msg
            if (this.state.not_found === false){

                //Letting the user know what messages he is currently viewing.
                if(this.state.sender_mode){
                    type = 'sent'
                }else{
                    type = 'received'
                }

                view_msg = <h1 className="message">You are now viewing {type} messages. </h1>
    
                //Defining the pagination component.            
                paginate = 
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
            

            
                results =         
                    <div>                    
                        {paginate}
                        {this.state.postData}
                        {paginate}
                    </div>
            

            }else{ //Defining a message if no messages exist yet.
                not_found_msg = <h1 className="message">Sorry, nothing found.</h1>
            }

            return(
                <div>
                {create_str}
                {view_msg}
                {sent}
                {received}
                {results}
                {not_found_msg}
                </div>
            )

        }else{ //Only hosts and renters may handle messages.
            return(<h1 className="message" >You can't access this page!</h1>)
        }

    }

}

export default MessageList