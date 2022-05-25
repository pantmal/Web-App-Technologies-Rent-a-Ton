import React from 'react';
import {Component} from 'react';

import axios from '../AXIOS_conf'

//CreateMessage component so a user can post a new message
class CreateMessage extends Component{
    
    constructor(props){
        super(props)

        let default_mode = false

        //In CreateMessage we may specify a default receiver username through the URL link. 
        //If so, we are in 'default_mode', otherwise the sender will specify the receiver's username.
        let query = this.props.match.params
        let rec_id = '';
        if (query.parameters!=null){
            default_mode = true

            rec_id = query.parameters
        }

        this.state = {
            default_mode: default_mode,
            rec_id: rec_id,
            username:'',
            title:'',
            content:'',
            errors: {}
        }

        this.handleUsernameChange = this.handleUsernameChange.bind(this)
        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleContentChange = this.handleContentChange.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
    }      

    componentDidMount(){

        //Getting the receiver's username if we're on default mode.
        if(this.state.rec_id !== ''){
            axios.get(`users/userList/${this.state.rec_id}`/*, {
                headers: {
                Authorization: `JWT ${localStorage.getItem('storage_token')}`
                }}*/).then( 
                response => {
                    const res_user = response.data
                    this.setState({
                        username: res_user.username
                    })
                }
            )

        }
        
    }

    //Handling the create message fields.

    handleUsernameChange = event => {
        const form_name = event.target.value
        this.setState({
            username: form_name
        })
    }

    handleTitleChange = event => {
        const form_title = event.target.value
        this.setState({
            title: form_title
        })
    }

    handleContentChange = event => {
        const form_content = event.target.value
        this.setState({
            content: form_content
        })
    }

    //Validating the form data and setting the errors object accordingly.
    handleValidation(){
        
        let errors = {};
        let formIsValid = true;

        if(this.state.username == ''){
            formIsValid = false;
            errors["name"] = "\u2757Cannot be empty";
        }

        if(this.state.username == this.props.app_state.username ){
            formIsValid = false;
            errors["name"] = "\u2757Cannot sent a message to yourself";
        }
        

        if(this.state.title == ''){
            formIsValid = false;
            errors["title"] = "\u2757Cannot be empty";
        }

        if(this.state.content == ''){
            formIsValid = false;
            errors["content"] = "\u2757Cannot be empty";
        }

        this.setState({errors: errors});

        return formIsValid;
    }

    //If handleValidation() returns true, which means the data is ok, we add the message to the database.
    handleFormSubmit = event => {
        event.preventDefault()

        if(this.handleValidation()){

            //Getting the receiver user item using his username.
            const data = {username: this.state.username}
            axios.post(
                'users/getUserByName/', JSON.stringify(data), {headers: {
                    'Content-Type': 'application/json'/*,
                    Authorization: `JWT ${localStorage.getItem('storage_token')}`*/
                }}
            ).then( response => {
                console.log(response)
                this.setState({
                    rec_id: response.data.pk
                })

                //Getting the current date
                let date = new Date();
                let year = date.getFullYear()
                let month = date.getMonth()+1
                let day = date.getDate()
                let hour = date.getHours()
                let minutes = date.getMinutes()
                let secs = date.getSeconds()

                let date_now = `${year}-${month}-${day}T${hour}:${minutes}:${secs}Z`
                console.log(this.props.app_state.username)
                const msg_data = {
                    sender: this.props.app_state.user_primary_key,
                    receiver: this.state.rec_id,
                    sender_name: this.props.app_state.username,
                    receiver_name: this.state.username,
                    title: this.state.title,
                    content: this.state.content,
                    date: date_now
                }

                console.log(msg_data)

                //Adding the message in the database.
                axios.post(
                    'users/messageList/', JSON.stringify(msg_data), {headers: {
                        'Content-Type': 'application/json',
                        Authorization: `JWT ${localStorage.getItem('storage_token')}`
                    }}
                ).then( response => {
                    console.log(response)
                    alert('Your message has been sent successfully. You may see your sent and received messages at the message list.')
                }).catch(error => {
                    console.log(error.response)
                    alert('Some kind of error occured...')
                })

            
            }).catch(error => {
                console.log(error.response)
                alert('Some kind of error occured...')
            })

            
        }

    }

    //Render function displayes the fields so a user may post his message.
    render(){

        if(this.props.app_state.isRenter || this.props.app_state.isHost){
            let rec_field 
            if(this.state.default_mode){ //If default mode is on, set the receiver's username as a default value.
                rec_field =<div> <h2 className="message"> Send to: <input name="receiver" defaultValue={this.state.username} onChange={this.handleUsernameChange} /></h2> <br/></div>
            }else{
                rec_field =<div> <h2 className="message"> Send to: <input name="receiver" onChange={this.handleUsernameChange} /></h2> <br/></div>
            }

            return(
                <div>
                    <form onSubmit={this.handleFormSubmit}>
                        {rec_field}
                        <span style={{color: "red"}}>{this.state.errors["name"]}</span>
                        <h2 className="message"> Title: <input name="title" onChange={this.handleTitleChange} /></h2>
                        <span style={{color: "red"}}>{this.state.errors["content"]}</span>
                        <h5 className="message" > Message: <textarea onChange={this.handleContentChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["content"]}</span>
                        <br/>
                        <button className="apply">Send message!</button>
                    </form>
                </div>
            )
        }else{//Only hosts and renters may create messages.
            return(<h1 className="message" >You can't access this page!</h1>)
        }

        
    }

}


export default CreateMessage