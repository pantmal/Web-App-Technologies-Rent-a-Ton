import React from 'react';
import {Component} from 'react';
import {Link} from 'react-router-dom';

import './navbar.css'

//NavbarClass used for the navigation bar.
class NavbarClass extends Component{

    //Calling handleLogoutClick from the App state.
    handleNavLogOffClick = () => {
        this.props.app_state.handleLogoutClick();
    }

    handleNavLogInClick = () => {
        this.props.history.push('/login')
    }

    handleRegisterClick = () => {
        this.props.history.push('/register')
    }

    handleEditClick = () => {
        this.props.history.push(`/editProfile/${this.props.app_state.user_primary_key}`)
    }

    handleAdminPageClick = () => {
        this.props.history.push('/adminPage')
    }
    
    handleHostPageClick = () => {
        this.props.history.push('/hostPage')
    }

    //Render function displays all the necessary links and buttons.
    render(){
        let login_check = this.props.app_state.isLoggedIn;
        if (login_check === true){
            let role;
            let admin_link
            let host_link
            let edit_link

            //Defining links for the Admin and Host pages.
            if (this.props.app_state.isAdmin){
                role = 'admin'
                admin_link = <button className="admin-host" onClick={this.handleAdminPageClick} ><span>Admin Page</span></button>
            }else if(this.props.app_state.isHost && !this.props.app_state.isRenter ){
                role = 'host'
                host_link = <button className="admin-host" onClick={this.handleHostPageClick} ><span>Host Page</span></button>
            }else if(this.props.app_state.isRenter && !this.props.app_state.isHost){
                role = 'renter'
            }else if(this.props.app_state.isRenter && this.props.app_state.isHost){
                role = 'host and renter'
                host_link = <button className="admin-host" onClick={this.handleHostPageClick} ><span>Host Page</span></button>
            }else{ //Debug purpose only.
                role = 'um...'
            }

            
            //Returning a link to the home page, the other pages if needed, a link to the Edit Profile and a Logout button.
            return(
        
                <nav className="nav">
                    <Link to="/"><h3><span className="logo">Rent-a-Ton</span></h3></Link> 
                    {admin_link}
                    {host_link}
                    <button className="edit" onClick={this.handleEditClick} ><span>Edit Profile</span></button>
                    <button className="logout" onClick={this.handleNavLogOffClick} ><span>Logout</span></button>
                    
                </nav>
    
            )
        }

        //Used for anonymous users.
        return(

            <nav className="nav">
                <Link to="/"><h3><span className="logo">Rent-a-Ton</span></h3></Link> 
                <button className="register" onClick={this.handleRegisterClick} ><span>Register</span></button>
                <button className="login" onClick={this.handleNavLogInClick} ><span>Login</span></button>
            </nav>

        )
    }

}

export default NavbarClass