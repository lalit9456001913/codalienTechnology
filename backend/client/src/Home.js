
import React from 'react';
import Login from './Login';
import './home.css'
import { Redirect, BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

class Home extends React.Component{
    constructor(props){
        super(props)
        this.state={
            redirectToLoginPage:false,
            showEmailInPutField:false,
            url:'',
            frequency:'',
            userEmail:'',
            phoneNumber:'',
            login:false
        }
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    componentDidMount(){
        let email=localStorage.getItem('email')
        let phoneNumber=localStorage.getItem('phoneNumber')
        if(email || phoneNumber){
            console.log('inside if')
            this.setState({
                login:true
            })
        }
    }
    handleOnChange(event){
        console.log(event.target.name,event.target.value)
        this.setState({
            [event.target.name]:event.target.value
        })
    }
    goOnLoginPage=()=>{
        this.setState({
            redirectToLoginPage:true
        })
    }
    goOnEmailField=()=>{
        if(this.state.url.length>0  && Number(this.state.frequency)>0){
            this.setState({
                showEmailInPutField:true,
                url:this.state.url,
                frequency:this.state.frequency,
                userEmail:this.state.userEmail,
                phoneNumber:this.state.phoneNumber
            })
        }
    }
    submitForm=(e)=>{
        e.preventDefault()
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ url: this.state.url,frequency: this.state.frequency,email:this.state.userEmail,phoneNumber:this.state.phoneNumber })
        };
        
        fetch('/monitorUrl', requestOptions)
            .then(response=> {
                console.log(response)
                if(response.ok){
                    this.setState({
                        showEmailInPutField:false,
                        url:'',
                        frequency:''
                    })
                }
            })
        }

    render(){
       if(this.state.login){
           return <Redirect to='/userdata' />
       }
        if(this.state.redirectToLoginPage){
            return <Redirect to='/loginPage' />
        }
        if(this.state.showEmailInPutField){
            console.log('inside showEmailInputField')
            return (
                <div className="userform">
                    please put your email or phone number anyone is mandatory
                    <br></br><br></br>
                    <form onSubmit={this.submitForm} autoComplete="off">
                        <label for="phoneNumber">useremail :</label>&nbsp; &nbsp; &nbsp;
                        <input type="email" id="fname" name="userEmail" onChange={(e)=>this.handleOnChange(e)} value={this.state.userEmail} />
                        <br></br>
                        or
                        <br></br>
                        <label for="phoneNuber">Phone number :</label>&nbsp; &nbsp; &nbsp;
                        <input type="tel" id="phoneNumber" name="phoneNumber" onChange={(e)=>this.handleOnChange(e)} pattern="[7-9]{0-9}-[0-9]{0-9}-[0-9]{0-9}" value={this.state.phoneNumber} />
                        <br></br><br></br>
                        &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; <input type="submit" value="Submit" />
                    </form>
                </div>
            )
        }
        return (
            <div className="App">
            <br></br>
                <div className="loginBtn">
                    <button type="button" onClick={()=>this.goOnLoginPage()}>Login</button>
                </div>
                <div>
                    <Link to='/admin'>go to admin panel</Link>
                </div>
                    <div className="homepage">
                        <label>put your url here: &nbsp; &nbsp;
                            <input type="text" className="url" value={this.state.url} name="url" onChange={this.handleOnChange} />
                        </label>
                        
                        <select value={this.state.frequency} onChange={this.handleOnChange} name="frequency">
                            <option value="">None</option>
                            <option value="10">10s</option>
                            <option value="60">1m</option>
                            <option value="300">5m</option>
                            <option value="600">10m</option>
                            <option value="3600">1hr</option>
                            <option value="14400">4hr</option>
                            <option value="21600">6hr</option>
                        </select>
                        <br></br><br></br>
                        <input type="submit" value="monitor" onClick={(e)=>this.goOnEmailField()}/>
                    </div>
            </div>  
        )
    }
}
export default Home;