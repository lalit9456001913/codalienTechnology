import React from 'react';
import { Redirect, BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Userdata from './userData';
import OtpPage from './otpPage.js'
class AdminLogin extends React.Component{
    constructor(props){
        super(props)
        console.log('this.props......',this.props)
        this.state={
            userEmail:'',
            phoneNumber:'',
            redirectToOtpPage:false
        }
    }
    handleOnChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    submitForm=(e)=>{
        e.preventDefault()
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ userEmail: this.state.userEmail,phoneNumber: this.state.phoneNumber })
        };
        console.log(requestOptions)
        fetch('/login', requestOptions)
            .then(response=> {
                console.log('response',response)
              if(response.status==200){
                this.setState({
                  redirectToOtpPage:true,
                })
              }
            })
        }

    render(){
        let email =localStorage.getItem('email')
        let phoneNumber = localStorage.removeItem('phoneNumber')
        if(email || phoneNumber){
            return <Redirect to='/userdata' />
        }
        if(this.state.redirectToOtpPage){
            return <OtpPage email={this.state.userEmail} phoneNumber={this.state.phoneNumber} />
        }
        return (
            <>
            <br></br>
            <div className="userform">
            please enter email or phone number any one is mandatory
            <br></br><br></br>
            <form onSubmit={this.submitForm} autoComplete="off">
                <label for="phoneNumber">useremail :</label>&nbsp; &nbsp; &nbsp;
                <input type="email" id="fname" name="userEmail" onChange={(e)=>this.handleOnChange(e)} value={this.state.userEmail} />
                <br></br>
                <br></br>
                <label for="phoneNuber">PhoneNumber:</label>&nbsp; &nbsp; &nbsp;
                <input type="tel" id="phoneNumber" name="phoneNumber" onChange={(e)=>this.handleOnChange(e)} value={this.state.phoneNumber} />
                <br></br><br></br>
                &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; <input type="submit" value="Submit" />
            </form>
            </div>
            </>
        )
    }
}
export default AdminLogin;