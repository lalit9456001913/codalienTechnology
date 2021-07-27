import React from 'react';
import { Redirect, BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Userdata from './userData';
import './home.css'

class OtpPage extends React.Component{
    constructor(props){
        console.log(props)
        super(props)
        this.state={
            otp:'',
            login:false,
            email:this.props.email,
            phoneNumber:this.props.phoneNumber,
            showError:false,
            role:this.props.role
        }
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    handleOnChange(event) {
        this.setState({[event.target.name]: event.target.value});
      }

    submitForm=(e)=>{
        
        e.preventDefault()
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ otp: this.state.otp,email:this.state.email,phoneNumber:this.state.phoneNumber})
        };
        fetch('/verifyOtp', requestOptions)
            .then(response=> {
                console.log('response...',response)
              if(response.ok){
                  if(this.state.role=="admin"){
                      localStorage.setItem("role","admin")
                  }else{
                    localStorage.setItem("role","normal")
                  }
                localStorage.setItem('email',this.state.email)
                localStorage.setItem('phoneNumber',this.state.phoneNumber)
                this.setState({
                  login:true
                })
              }else{
                  this.setState({
                      showError:true
                  })
               }
            })
        }
    

    
    render(){
        if(this.state.login){
            if(this.state.role=="admin"){
                return <Redirect to='/admin' />
            }
            return <Redirect to='/userdata' />
        }
       
        return (
            <>
            <br></br>
            <div><Link to='/' >go to home page</Link></div>
            <div className="otpform">
                <h3>enter otp here</h3>
                <form onSubmit={this.submitForm} autoComplete="off">
                <input type="text" id="otp" name="otp" onChange={this.handleOnChange} value={this.state.otp} />
                    <input type="submit" value="Submit" />
                </form>
                {this.state.showError?<div className="showError">otp does not match try again</div>:null}
            </div>
            </>
        )
    }
}
export default OtpPage;