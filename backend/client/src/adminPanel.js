import React from 'react';
import io from 'socket.io-client';
import { Redirect, BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Edit from './Edit.js'
import './userData.css';
let socket = io()
class AdminPanel extends React.Component{
    constructor(props){
       
        super(props)
        console.log('props is this',this.props.match.path)
        this.state={
            allUserUrlStatus:[],
            frequency:'',
            logout:false,
            login:false,
            showUpdateDialogueBox:false,
            updateObj:'',
            frequency:'',
            path:this.props.match.path
        }
    }

    handleOnChange=(event)=>{
        this.setState({
            [event.target.name]:event.target.value
        })
    }
    componentDidMount(){
        let email = localStorage.getItem('email')
        let phoneNumber = localStorage.getItem('phoneNumber')
        let routeParams = email?email:phoneNumber
        console.log(routeParams)
        if(routeParams!=undefined || routeParams!=null){
            fetch('/getAllData/'+routeParams).then(response=>response.json()).then(data=>{
                console.log('data......',data)
                  this.setState({
                      allUserUrlStatus:data.data,
                  })
             })
        }
       
        socket.on('/sendStatus/'+email,data=>{
          console.log('inside socket')
          console.log(data)
          let temp = this.state.allUserUrlStatus
          for(let i=0;i<temp.length;i++){
              if(temp._id===data._id){
                  temp.status=data.status
                  this.setState({
                    allUserUrlStatus:temp
                  })
              }
          }
        })
    }
    
   
    showUpdateDialogueBoxFlag=()=>{
        let email = localStorage.getItem('email')
        let phoneNumber = localStorage.getItem('phoneNumber')
        let routeParams = email.length>0?email:phoneNumber
        
        fetch('/getAllData/'+routeParams).then(response=>response.json()).then(data=>{
              console.log('data......',data)
                this.setState({
                    showUpdateDialogueBox:false,
                    allUserUrlStatus:data.data,
                })
           })
    }

    logout=()=>{
        localStorage.removeItem("email");
        localStorage.removeItem('phoneNumber')
        localStorage.removeItem('role')
        let email = localStorage.getItem("email")
        let phoneNumber = localStorage.getItem("phoneNumber")
        if(email==undefined && phoneNumber==undefined){
            this.setState({
                login:false
            })
        }
    }
    delete=(obj)=>{
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({urlMonitorObj: obj })
         };
       
         fetch('/delete',requestOptions).then(response=>{
            if(response.ok){
                let temp = this.state.allUserUrlStatus.filter(allUserUrlStatusObj=>allUserUrlStatusObj._id!==obj._id)
                this.setState({
                  allUserUrlStatus:temp
                })
            }
         }) 
    }
    edit=(obj)=>{
        this.setState({
            showUpdateDialogueBox:true,
            updateObj:obj
        })
    }

    render(){
        let email = localStorage.getItem('email')
        let phoneNumber = localStorage.getItem('phoneNumber')
        if(!email && !phoneNumber){
            return <Redirect to='/adminLogin' />
        }
       if(this.state.showUpdateDialogueBox){
           return <Edit showUpdateDialogueBoxFlag={this.showUpdateDialogueBoxFlag} obj={this.state.updateObj} />
       }
        return(
            <div>
                <div className="logoutbtn"><button onClick={this.logout} >Logout</button></div>
                <table className="urlMonitor">
                    <tr className="headingRow">
                        <th>Url</th>
                        <th>Frequency</th>
                        <th>status</th>
                    </tr>

                    {this.state.allUserUrlStatus.map((obj)=>(
                         <tr className="dataRow">
                           
                                <td className="urlcoln"><div class="url">{obj.url}</div></td>
                                <td className="frequencycoln">
                                   {obj.frequency>=3600?(obj.frequency)/3600+'hr':obj.frequency>=60?(obj.frequency)/60+'m':(obj.frequency)+'s'}
                                </td>
                                <td className="statuscoln">{obj.status==200?<div class="success">{obj.status}</div>:<div class="failure">{obj.status}</div>}</td>
                              
                                <td><button type="button" className="updatebtn" onClick={(e)=>this.edit(obj)}>edit</button></td>
                               
                            
                            <td><button type="button" className="deletebtn" onClick={(e)=>this.delete(obj)}>Delete</button></td>
                           
                         </tr>
                    )
                    )}
                   
                </table>
            </div>
        )
    }
}
export default AdminPanel;