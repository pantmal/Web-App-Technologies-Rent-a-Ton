import React from 'react';
import {Component} from 'react';

import axios from '../AXIOS_conf'

//Register component so a new user may register.
class Register extends Component{
    
    constructor(props){
        super(props)

        this.state = {
            username: '',
            password: '',
            validation_pswd: '',
            first_name: '',
            last_name:'',
            email:'',
            phone:'',
            host: false,
            renter: false,
            picture: '',
            imagePreviewUrl: '',
            errors: {}
        }

        this.handleUsernameChange = this.handleUsernameChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleValidPasswordChange = this.handleValidPasswordChange.bind(this)
        this.handleFirstnameChange = this.handleFirstnameChange.bind(this)
        this.handleLastnameChange = this.handleLastnameChange.bind(this)
        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handlePhoneChange = this.handlePhoneChange.bind(this)
        this.handleHostChange = this.handleHostChange.bind(this)
        this.handleRenterChange = this.handleRenterChange.bind(this)
        this.handleImageChange = this.handleImageChange.bind(this); 
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
    }

    //Handling changes in the register form.
    
    handleUsernameChange = event => {
        const form_name = event.target.value
        this.setState({
            username: form_name
        })
    }

    handlePasswordChange = event => {
        const form_pswd = event.target.value
        this.setState({
            password: form_pswd
        })
    }

    handleValidPasswordChange = event => {
        const form_valid_pswd = event.target.value
        this.setState({
            validation_pswd: form_valid_pswd
        })
    }


    handleFirstnameChange = event => {
        const form_first_name = event.target.value
        this.setState({
            first_name: form_first_name
        })
    }

    handleLastnameChange = event => {
        const form_last_name = event.target.value
        this.setState({
            last_name: form_last_name
        })
    }
    
    handleEmailChange = event => {
        const form_email = event.target.value
        this.setState({
            email: form_email
        })
    }
    
    handlePhoneChange = event => {
        const form_phone = event.target.value
        this.setState({
            phone: form_phone
        })
    }
    
    handleHostChange = event => {
        this.setState(prevState => {return{
            host: !prevState.host
        }})
    }

    handleRenterChange = event => {
        this.setState(prevState => {return{
            renter: !prevState.renter
        }})
    }

    //FileReader() used for image changes.
    handleImageChange = (event) => {
        event.preventDefault();
    
        let f_reader = new FileReader();
        let file = event.target.files[0];
    
        f_reader.onloadend = () => {
          this.setState({
            picture: file,
            imagePreviewUrl: f_reader.result
          });
        }
        

        f_reader.readAsDataURL(file)
      }

      //Validating the register form data and setting the errors object accordingly.
      handleValidation(){
        
        let errors = {};
        let formIsValid = true;

        if(this.state.username == ''){
           formIsValid = false;
           errors["name"] = "\u2757Cannot be empty";
        }

        if(this.state.password == ''){
            formIsValid = false;
            errors["pswd"] = "\u2757Cannot be empty";
        }

        if(this.state.validation_pswd == ''){
            formIsValid = false;
            errors["v_pswd"] = "\u2757Password is not validated";
        }
        
        if(this.state.password !== this.state.validation_pswd){//Password validation.
            formIsValid = false;
            errors["v_pswd"] = "\u2757The two password fields are not the same";
        }

        if(this.state.first_name == ''){
            formIsValid = false;
            errors["f_name"] = "\u2757Cannot be empty";
        }

        if(this.state.first_name != ''){
            if(!this.state.first_name.match(/^[a-zA-Z]+$/)){
                formIsValid = false;
                errors["f_name"] = "\u2757Only letters";
            }        
        }
         
        if(this.state.last_name == ''){
            formIsValid = false;
            errors["l_name"] = "\u2757Cannot be empty";
        }

        if(this.state.last_name != ''){
            if(!this.state.last_name.match(/^[a-zA-Z]+$/)){
                formIsValid = false;
                errors["l_name"] = "\u2757Only letters";
            }
        }

        if(this.state.email == ''){
            formIsValid = false;
            errors["email"] = "\u2757Cannot be empty";
        }

        if(this.state.phone == ''){
            formIsValid = false;
            errors["phone"] = "\u2757Cannot be empty";
        }
       
        if(this.state.phone != ''){
            if(!this.state.phone.match(/^[0-9]+$/)){ 
                formIsValid = false;
                errors["phone"] = "\u2757Only numbers";
            }
        }

        if(this.state.host === false && this.state.renter === false){
            formIsValid = false;
            errors['role'] = '\u2757Pick at least one role'
        }

        if(this.state.picture == ''){
            formIsValid = false;
            errors["picture"] = "\u2757Cannot be empty";
        }
        

        this.setState({errors: errors});

        return formIsValid;
    }


    //If handleValidation() returns true, which means the data is ok, call proceedSubmission()
    handleFormSubmit = event => {
        event.preventDefault()
        
        if(this.handleValidation()){
            this.proceedSubmission()
        }

    }

    //In proceedSubmission() an axios.post request is made to add the new user in the database.
    proceedSubmission(){
        let approval = true
        if(this.state.host){
            approval = false
        }

        const data = {
            username: this.state.username,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password,
            is_staff: false,
            telephone: this.state.phone,
            approved: approval,
            is_host: this.state.host,
            is_renter: this.state.renter,
            picture: this.state.picture
        }

        const formData = new FormData();//FormData used in case we have pictures.

        formData.append("username", data.username);
        formData.append("password", data.password);
        formData.append("first_name", data.first_name);
        formData.append("last_name", data.last_name);
        formData.append("email", data.email);
        formData.append("telephone", data.telephone);
        formData.append("is_staff", data.is_staff);
        formData.append("approved", data.approved);
        formData.append("is_host", data.is_host);
        formData.append("is_renter", data.is_renter);
        formData.append("picture", data.picture);
        formData.append("secondary_id", 1);


        axios.post('users/userList/', formData, {headers: {
            'Content-Type': 'application/json'
          }}).then(response => {alert('You have successfully registered! Now proceed to log in at the navigation bar to continue using the application.');
          if (data.is_host){ //Displaying a message for new hosts, telling them their request is pending.
            alert('Since you have chosen the role of the host you will have to wait until further notice. The admin will activate your account sometime.')
          }  
            }).catch(error => {console.log(error.response);  
                if(error.response.request.response.includes("A user with that username already exists")){ //Alerting the user if the name he tried to add is used by another user. 
                    alert('A user with that username already exists. Please fill in the register form again with a different username.')
                }else{
                    alert('Some kind of error occured, please try again.')
                }
            }).finally(() => { //Redirecting to the home page.
                this.props.history.push("/");
            })
    }

    //Render function displays the register form.
    render(){

        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img src={imagePreviewUrl} style={{width:500,height: 500}} />);
        }

        let login_check = this.props.app_state.isLoggedIn;
        if (login_check === true){ //Appropriate message for users who are already registered.
            return(
                <h1 className="message">You are already a registered user!</h1>
            )
        }else{ //Defining the register form.
            return(

                <div>
                    <form onSubmit={this.handleFormSubmit}>
                        <h1 className="message"> Create a new account using the following form:</h1>
                        <h5 className="message" > Enter your name here: <input name="username" onChange={this.handleUsernameChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["name"]}</span>
                        <h5 className="message" > Enter your password here: <input name="pswd" type="password" onChange={this.handlePasswordChange} /></h5>
                        <span style={{color: "red"}}>{this.state.errors["pswd"]}</span>
                        <h5 className="message" > Please validate your password: <input name="valid_pswd" type="password" onChange={this.handleValidPasswordChange} /></h5>
                        <span style={{color: "red"}}>{this.state.errors["v_pswd"]}</span>
                        <h5 className="message" > Enter your first name here: <input name="fist_name" onChange={this.handleFirstnameChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["f_name"]}</span>
                        <h5 className="message" > Enter your last name here: <input name="last_name" onChange={this.handleLastnameChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["l_name"]}</span>
                        <h5 className="message" > Enter your email here: <input type="email" name="email" size="30" onChange={this.handleEmailChange}/></h5> 
                        <span style={{color: "red"}}>{this.state.errors["email"]}</span>
                        <h5 className="message" > Enter your phone here: <input type="tel" name="phone" size="30" onChange={this.handlePhoneChange}/></h5>
                        <span style={{color: "red"}}>{this.state.errors["phone"]}</span>
                        <h5 className="message" >Choose your role here. You may choose host or renter or both</h5>
                        <h5 className="message" > Host:<input type="checkbox" name="host" onChange={this.handleHostChange}/></h5> 
                        <h5 className="message" > Renter:<input type="checkbox" name="renter" onChange={this.handleRenterChange}/></h5> 
                        <span style={{color: "red"}}>{this.state.errors["role"]}</span> <br/>
                        {$imagePreview} <br/>
                        <h5 className="message" >Choose your picture here: <input type="file" accept='image/*' onChange={this.handleImageChange} /> </h5> <br/> <br/>
                        <span style={{color: "red"}}>{this.state.errors["picture"]}</span> <br/>
                        <button className="apply" >Submit!</button>
                    </form>
                </div>

            )
        }
    }
}

export default Register