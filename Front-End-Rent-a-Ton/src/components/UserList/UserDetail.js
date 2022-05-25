import React from 'react';
import {Component} from 'react';

import axios from '../AXIOS_conf'

//UserDetail component so an admin may view the data of a user and approve him if he's a host.
class UserDetail extends Component{

    constructor(props){
        super(props)

        this.state = {
            username: '',
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            picture: '',
            admin: false,
            host: false,
            renter: false,
            approval: false
        }

        this.handleApprovalChange = this.handleApprovalChange.bind(this)
    }

    //Getting the user item from the server.
    componentDidMount(){

        const {id} = this.props.match.params
        axios.get(`users/userList/${id}`/*, {
            headers: {
              Authorization: `JWT ${localStorage.getItem('storage_token')}`
            }}*/).then( 
            response => {

                //Updating the state.
                const res_user = response.data
                this.setState({
                    username: res_user.username,
                    picture: res_user.picture,
                    first_name: res_user.first_name,
                    last_name: res_user.last_name,
                    email: res_user.email,
                    phone: res_user.telephone,
                    host: res_user.is_host,
                    admin: res_user.is_staff,
                    renter: res_user.is_renter,
                    approval: res_user.approved
                })
            }
        )
    }

    //Updating a host's approval status.
    handleApprovalChange(){

        const id_match = this.props.match.params.id
        const data_send = {ID: id_match, activation: !this.state.approval}
        axios.post(
            'users/approveUser/', JSON.stringify(data_send), {headers: {
                'Content-Type': 'application/json',
                Authorization: `JWT ${localStorage.getItem('storage_token')}`
            }}
        ).then( response => {
            alert('The status of this host has been successfully updated.')
            this.setState(prevState =>{ //Changing the state with the new status.
                return{
                    approval: !prevState.approval
                }
            })
        }).catch(error => {
            console.log(error.response)
            alert('Some kind of error occured...')
        })

    }
    
    //Render function diplays the user's data and a button to change his status, if he is a host.
    render(){

        let permission = false
        
        let login_check = this.props.app_state.isLoggedIn;
        if (login_check){
            if (this.props.app_state.isAdmin){
             permission = true
            }
        }

        let button_string 
        let button_obj
        
        if(this.state.host){ //Defining the required button if the user is a host.
            button_string = this.state.approval ? "Deactivate this host" : "Approve this host"
            button_obj = <button className="apply" onClick={this.handleApprovalChange}>{button_string}</button>
        }
        
        if (!permission){ //Denying access to non-admins.
            return(
                <h1 className="message">You can't access this page!</h1>
            )
        }else{ //Displaying the user's data (and the approval button if needed)
            return(
                <div>
                    <div className="message">Username: {this.state.username}</div> <br/>
                    <div className="message">Profile picture: <img src={this.state.picture} style={{width:500,height: 500}} /> </div> <br/>
                    <div className="message">First name: {this.state.first_name}</div>  <br/>  
                    <div className="message">Last name: {this.state.last_name}</div>   <br/> 
                    <div className="message">Email: {this.state.email}</div>  <br/> 
                    <div className="message">Phone: {this.state.phone}</div>  <br/> 
                    <div className="message">Admin: {this.state.admin ? '\u2705':'\u274c'}</div> <br/>
                    <div className="message">Host: {this.state.host ? '\u2705':'\u274c'} </div> <br/>
                    <div className="message">Renter: {this.state.renter ? '\u2705':'\u274c'} </div> <br/>
                    {button_obj}        
                </div>
            )
        }
        
    }
}

export default UserDetail