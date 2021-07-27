import React from 'react';
import { Redirect, BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import './home.css'

class Edit extends React.Component{
    constructor(props){
        console.log(props)
        super(props)
        this.state={
               frequency:this.props.obj.frequency,
               url:this.props.obj.url,
               status:this.props.obj.status,
               id:this.props.obj._id,
               goToUserDataPage:false
          }
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    handleOnChange(event) {
        this.setState({[event.target.name]: event.target.value});
      }

    update=(e)=>{
        
        e.preventDefault()
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({id:this.state.id,frequency:this.state.frequency})
        };
        fetch('/update', requestOptions)
            .then(response=> {
                console.log('response...',response)
              if(response.ok){
                this.props.showUpdateDialogueBoxFlag(false)
              }
            })
        }
    

    
    render(){
        if(this.state.goToUserDataPage){
            console.log('inside it',this.state.goToUserDataPage)
            return <Redirect to='/userdata' />
        }
       
        return (
            <>
            <br></br>

            <div className="otpform">
                <h3>update frequency of url</h3>
                <form onSubmit={this.update} autoComplete="off">
                <div>
                    <div><h3>url</h3>{this.state.url}</div>
                    <div><h3>frequency</h3>
                        <select value={this.state.frequency} onChange={this.handleOnChange} name="frequency">
                            <option value="10">10s</option>
                            <option value="60">1m</option>
                            <option value="300">5m</option>
                            <option value="600">10m</option>
                            <option value="3600">1hr</option>
                            <option value="14400">4hr</option>
                            <option value="21600">6hr</option>
                        </select>
                    </div>
                    <div><h3>status</h3>{this.state.status}</div>
                </div>
                <br></br>
                <input type="submit" value="Submit" />
                </form>
                {this.state.showError?<div className="showError">something went wrong</div>:null}
            </div>
            </>
        )
    }
}
export default Edit;