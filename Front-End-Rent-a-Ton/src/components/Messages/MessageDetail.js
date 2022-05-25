import React from 'react';
import {Component} from 'react';

import ReactPaginate from 'react-paginate';
import {Link} from 'react-router-dom';

import axios from '../AXIOS_conf'


//MessageDetail used so a user may update one of his messages (if he's the sender) or reply to them (if he's the receiver).
class MessageDetail extends Component{

    constructor(props){
        super(props)

        this.state = {
            sender_mode: false,
            pk: '',
            sender_name: '',
            receiver_name: '',
            sender: '',
            receiver: '',
            title: '',
            content: '',
            date:'',
            reply:'',
            errors: {},
            offset: 0,
            users: [],
            perPage: 10,
            currentPage: 0
        };

        this.handleContentChange = this.handleContentChange.bind(this)
        this.handleReplyChange = this.handleReplyChange.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleReplySubmit = this.handleReplySubmit.bind(this)

    }

    //Getting the message data and setting the viewform of the page (depending if the user is sender or not).
    componentDidMount(){

        let id = this.props.match.params.id
        axios.get(
            `users/messageList/${id}`, {headers: {
                'Content-Type': 'application/json',
                Authorization: `JWT ${localStorage.getItem('storage_token')}`
            }}
        ).then( response => {
            console.log(response)
            this.setState({
                pk: response.data.pk,
                sender_name: response.data.sender_name,
                receiver_name: response.data.receiver_name,
                sender: response.data.sender,
                receiver: response.data.receiver,
                title: response.data.title,
                content: response.data.content,
                date: response.data.date
            })

            if (this.props.app_state.user_primary_key == response.data.sender){
                this.setState({
                    sender_mode: true
                })  
            }else{
                this.setState({
                    sender_mode: false
                })
            }

        }).catch(error => {
            console.log(error.response)
            alert('Some kind of error occured...')
        })



    }

    //Handling change in the 'reply' text area.
    handleReplyChange = event => {
        const form_reply = event.target.value
        this.setState({
            reply: form_reply
        })
    }

    //Validating the reply form.
    handleReplyValidation(){
        
        let errors = {};
        let formIsValid = true;

        if(this.state.reply == ''){
            formIsValid = false;
            errors["reply"] = "\u2757Cannot be empty";
        }

        this.setState({errors: errors});

        return formIsValid;
    }

    //If handleReplyValidation() returns true, which means the data is ok, we add the message to the database.
    handleReplySubmit(){
        

        if(this.handleReplyValidation()){

            let date = new Date();
            let year = date.getFullYear()
            let month = date.getMonth()+1
            let day = date.getDate()
            let hour = date.getHours()
            let minutes = date.getMinutes()
            let secs = date.getSeconds()

            let date_now = `${year}-${month}-${day}T${hour}:${minutes}:${secs}Z`
            console.log(this.props.app_state.username)
            const msg_data = { //Title is same with the one he's replying on, except for the 'Re:' at the start.
                sender: this.props.app_state.user_primary_key,
                receiver: this.state.sender,
                sender_name: this.props.app_state.username,
                receiver_name: this.state.sender_name,
                title: 'Re:'+this.state.title,
                content: this.state.reply,
                date: date_now
            }

            axios.post(
                'users/messageList/', JSON.stringify(msg_data), {headers: {
                    'Content-Type': 'application/json',
                    Authorization: `JWT ${localStorage.getItem('storage_token')}`
                }}
            ).then( response => {
                console.log(response)
                alert('Your reply has been sent successfully.')
            }).catch(error => {
                console.log(error.response)
                alert('Some kind of error occured...')
            })

        }

    }

    //Used when one wants to update one of his sent messages.
    handleContentChange = event => {
        const form_content = event.target.value
        this.setState({
            content: form_content
        })
    }

    //Validating the changes made in the 'content' text area.
    handleValidation(){
        
        let errors = {};
        let formIsValid = true;

        if(this.state.content == ''){
            formIsValid = false;
            errors["content"] = "\u2757Cannot be empty";
        }

        this.setState({errors: errors});

        return formIsValid;
    }

    //If handleValidation() returns true, which means the data is ok, we update the message in the database.
    handleUpdate = event =>{

        if(this.handleValidation()){

            let date = new Date();
            let year = date.getFullYear()
            let month = date.getMonth()+1
            let day = date.getDate()
            let hour = date.getHours()
            let minutes = date.getMinutes()
            let secs = date.getSeconds()

            let date_now = `${year}-${month}-${day}T${hour}:${minutes}:${secs}Z`
            const msg_data = {
                sender: this.props.app_state.user_primary_key,
                receiver: this.state.receiver,
                sender_name: this.state.sender_name,
                receiver_name: this.state.receiver_name,
                title: this.state.title,
                content: this.state.content,
                date: date_now
            }
    
            axios.patch(`users/messageList/${this.state.pk}/`, JSON.stringify(msg_data), {headers: {
                'Content-Type': 'application/json',
                Authorization: `JWT ${localStorage.getItem('storage_token')}`
                    
              }}).then(response => {alert('Your message has been updated.');  
                }).catch(error => {
                    console.log(error.response);   
                    alert('Some kind of error occured, please try again.')
                })

        }

        

    }

    //Deleting an existing message.
    handleDelete = event =>{

        axios.delete(`users/messageList/${this.state.pk}/`, {headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.getItem('storage_token')}`
                
          }}).then(response => {alert('Your message has been deleted. ');  
            this.props.history.push({pathname:'/userMessages/type=rec'})
            }).catch(error => {
                console.log(error.response);   
                alert('Some kind of error occured, please try again.')
            })

    }

    //Render functions displays different stuff depending on the viewform.
    render(){

        if(this.props.app_state.isRenter || this.props.app_state.isHost){

            let sender_stuff
            let receiver_stuff
            if(this.state.sender_mode){ //Senders may update or delete a message.
                sender_stuff = <div>
                <h2 className="message"> Sent to: {this.state.receiver_name}</h2>
                <h2 className="message"> Date: {this.state.date}</h2>
                <h2 className="message"> Title: {this.state.title}</h2>
                <h5 className="message" > Message: <textarea defaultValue={this.state.content} onChange={this.handleContentChange} /></h5> 
                <span style={{color: "red"}}>{this.state.errors["content"]}</span> <br/>
                <button className="apply" onClick={this.handleUpdate}>Update this message</button>
                <button className="apply" onClick={this.handleDelete}>Delete this message</button>
                </div>
            }else{ //Receivers may view a message and reply to it.
                receiver_stuff = <div>
                <h2 className="message"> Sent by: {this.state.sender_name}</h2>
                <h2 className="message"> Date: {this.state.date}</h2>
                <h2 className="message"> Title: {this.state.title}</h2>
                <h5 className="message" > Message: {this.state.content}</h5> 
                <h5 className="message" > Add a reply: <textarea onChange={this.handleReplyChange} /></h5> 
                <span style={{color: "red"}}>{this.state.errors["reply"]}</span> <br/>
                <button className="apply" onClick={this.handleReplySubmit}>Send your reply</button>
                </div>
            }


            return(
                <div>
                {sender_stuff}
                {receiver_stuff}
                </div>
            )

        }else{ //Only hosts and renters may handle messages.
            return(<h1 className="message" >You can't access this page!</h1>)
        }

    }

}


export default MessageDetail