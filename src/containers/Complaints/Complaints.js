import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import * as firebase from 'firebase';
import {connect} from 'react-redux';

import {sliceTime} from '../../Utils/Utility';
import Reports from '../../components/Reports/Reports';
import * as actions from '../../store/actions/index';
import Card from '../../hoc/Card/Card';
import Spinner from './../../components/UI/Spinner/Spinner';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import '../../Utils/Utility.css';

class Complaints extends Component{
    state = {
        city : '',
        status : '',
        loading : false
    }

    handleChange = (event,searchKey) => {
        const value = event.target.value;
        if(this.props.isAdmin){
            this.setState({ [event.target.name] : value }, () => {
                if(this.state.status !== '' && this.state.city !== ''){
                    this.setState({loading : true});
                    let query = firebase.database().ref('/complaints').orderByChild('city').equalTo(this.state.city)
                    if(this.state.city === 'all')
                        query = firebase.database().ref('/complaints')
    
                    query.on('value' , snapshot => {
                        const complaintsObj = snapshot.val();
                        let complaints = [];
                        for(let key in complaintsObj){
                            if(complaintsObj[key].status === this.state.status ||  this.state.status === 'all')
                                complaints.push({id : key, ...complaintsObj[key]})
                        }
                        this.props.onSetReports(complaints);
                        this.setState({ loading : false});
                    });
                }
            });
        } 
        else{
            this.setState({ [event.target.name] : value, loading : true });
            firebase.database().ref('/complaints')
                .orderByChild('city')
                .equalTo(value)
                .on('value' , snapshot => {
                    const complaintsObj = snapshot.val();
                    let complaints = [];
                    for(let key in complaintsObj){
                        complaints.push({id : key, ...complaintsObj[key]})
                    }
                    this.props.onSetReports(complaints);
                    this.setState({ loading : false});
                });
        }
    }

    clickedHandler = () => {
        this.props.history.push("/reportComplaint")
    }

    render(){
        let reports = '';
        if((this.props.isAdmin && (this.state.city === '' || this.state.status === '')) 
            || this.state.city === '')
            reports = <p className = "search-messsage">Please Select {this.props.isAdmin ? "City and Status to Search" : "a City to Continue"}</p>
        else if(this.props.reports.length <= 0){
            reports = <p className = "search-messsage">No Complaints Found For The Selected {this.props.isAdmin ? "Combination" : "City"}</p>
        }    
        else{
            reports = (
                <div className = "reports-container">
                    {this.props.reports.map(report => {
                        let reportedAt = sliceTime(report.reportedAt)
                        let time = sliceTime(report.time)

                        let reason = null;
                        let finalResponse = null;
                        if(report.reason) 
                            reason = (<Aux><strong>Reason</strong> : {report.reason}<br/></Aux>)
                        if(report.finalResponseAt){
                            let finalResponseAt = new Date(report.finalResponseAt).toString();
                            finalResponseAt = finalResponseAt.slice(0,finalResponseAt.length - 34);     
                            finalResponse = <Aux><strong>{report.status ===  "Canceled" ? "Canceled" : "Satisfied"} At</strong> : {finalResponseAt}</Aux>
                        }
                        return(
                            <div 
                                className = "card-container complaints-card" 
                                key = {report.id} 
                                onClick = {this.props.isAdmin ? () => this.props.history.push(`/singleComplaint/${report.id}`) : null}>
                                <Card>
                                    <div className = "card-text">
                                        <strong>Reported By</strong> : {report.reportedBy}<br/>
                                        <strong>Reported At</strong> : {reportedAt}<br/>
                                        <strong>Against</strong> : {report.against}<br/>
                                        <strong>Type</strong> : {report.type}<br/>
                                        <strong>Description</strong> : {report.description}<br/>
                                        <strong>When</strong> : {time}<br/>
                                        <strong>Area</strong> : {report.area}<br/>  
                                        <strong>City</strong> : {report.city}<br/>
                                        <strong>Status</strong> : {report.status}<br/>
                                        {reason}
                                        {finalResponse}
                                    </div>    
                                </Card>
                            </div> 
                        )   
                    })}
                </div>
            )
        }   
        let registerationMsg = '';
        if(!this.props.isRegistered  && !this.props.isAdmin){
            registerationMsg = <p className = "reg-warning">Please Register as Reporter to Report Your Complaints</p>
        }
        return(
            <div>
                {!this.state.loading ?  
                    <Aux>
                        {registerationMsg}
                        <button 
                            className = "btn btn-info my-reports-button" 
                            disabled = {!this.props.isRegistered}
                            onClick = {this.clickedHandler}>Report New Complaint</button>
                        <Reports
                            showCities = {true}
                            showStatuses = {this.props.isAdmin}
                            handleChange = {this.handleChange}
                            city = {this.state.city}
                            status = {this.state.status}
                            reports = {reports}/>
                    </Aux> :  <div  className = "spinner"><Spinner/></div>
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return{
        reports : state.reports.reports,
        isAuth : state.auth.isAuth,
        isRegistered : state.auth.isRegistered,
        isAdmin : state.auth.isAdmin
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onSetReports : (reports) => dispatch(actions.setReports(reports))
    }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Complaints));