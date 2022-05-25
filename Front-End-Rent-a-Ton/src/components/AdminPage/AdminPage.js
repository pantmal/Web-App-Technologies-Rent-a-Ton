import React from 'react';
import {Component} from 'react';

import {Link} from 'react-router-dom';

import './adminPage.css'

import axios from '../AXIOS_conf'

//AdminPage is used by the admin so he may access the user list, or export data.
class AdminPage extends Component{


    constructor(props){
        super(props)

        this.handleXMLClick = this.handleXMLClick.bind(this)
        this.handleJSONClick = this.handleJSONClick.bind(this)
    }

    //Exporting data to XML
    handleXMLClick = event =>{

        alert('You have chosen to export data to XML format. You will be notified upon completion.')

        const data = {type:'xml'}

        axios.post('/rooms/exportData/',JSON.stringify(data), {headers: { 
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.getItem('storage_token')}`
          }}).then(response => {alert('The data has been successfully exported.');  
            }).catch(error => {
                console.log(error.response);   
                alert('Some kind of error occured, please try again.')
            })

    }

    //Exporting data to JSON.
    handleJSONClick = event =>{

        alert('You have chosen to export data to JSON format. You will be notified upon completion.')

        const data = {type:'json'}

        axios.post('/rooms/exportData/',JSON.stringify(data), {headers: { 
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.getItem('storage_token')}`
          }}).then(response => {alert('The data has been successfully exported.');  
            }).catch(error => {
                console.log(error.response);   
                alert('Some kind of error occured, please try again.')
            })

    }


    //Render function includes a text with a link to the user list and two buttons for the export formats.
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
        }else{ //Rendering the page.
            return(
                <div>
                <h1 className="message">Welcome dear admin. You make click <Link to={'/userList/'}><span>here</span></Link> to manage users. </h1>
                <h1 className="message">If you want to export data choose between <button className="apply" onClick={this.handleXMLClick}>XML</button> or <button className="apply" onClick={this.handleJSONClick}>JSON</button> format. </h1>
                </div>
            )
        }

        
    }

}

export default AdminPage