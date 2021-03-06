import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import * as firebase from 'firebase';
import {connect} from 'react-redux';

import {sliceTime} from '../../../Utils/Utility';
import Reports from '../../../components/Reports/Reports';
import * as actions from '../../../store/actions/index';
import Card from '../../../hoc/Card/Card';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import '../../../Utils/Utility.css';

class Complaints extends Component{
    state = {
        loading : false
    }

    componentDidMount(){
        this.setState({ loading : true });
        firebase.database()
            .ref('/complaints')
            .orderByChild('reporterId')
            .equalTo(`${this.props.uid}`)
            .on('value' , snapshot => {
                const complaintsObj = snapshot.val();
                let complaints = [];
                for(let key in complaintsObj){
                    complaints.push({id : key, ...complaintsObj[key]})
                }
                this.props.onSetReports(complaints);
                this.setState({ loading : false });
            }); 
    }

    clickedHandler = () => {
        this.props.history.push("/reportComplaint")
    }

    render(){
        let reports = '';
        if(this.props.reports.length <= 0){
            reports = <p className = "search-messsage">You Haven't Reported Any Complaints Yet <br/>
                        {this.props.isRegistered ? null : "Please Register as Reporter to Report Your Complaints"}</p> 
        }    
        else{
            reports = (
                <div className = "reports-container">
                    {this.props.reports.map(report => {
                        let time = sliceTime(report.time)                        
                        let reportedAt = sliceTime(report.reportedAt)
                        
                        let reason = null;       
                        let finalResponse = null;

                        if(report.reason) 
                            reason = <Aux><strong>Reason</strong> : {report.reason}<br/></Aux>
                        if(report.finalResponseAt){
                            let finalResponseAt = sliceTime(report.finalResponseAt) 
                            finalResponse = <Aux><strong>{report.status ===  "Canceled" ? "Canceled" : "Satisfied"} At</strong> : {finalResponseAt}</Aux>
                        }
                        return(
                            <div 
                                className = "card-container  complaints-card" 
                                key = {report.id} 
                                onClick = {this.props.isAdmin ? 
                                            () => this.props.history.push(`/singleComplaint/${report.id}`) : 
                                            null}>
                                <Card>
                                    <div className = "card-text">
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
        return(
            <div>
                {!this.state.loading ?  
                    <Aux>
                        <button 
                            className = "btn btn-info my-reports-button" 
                            disabled = {!this.props.isRegistered}
                            onClick = {this.clickedHandler}>Report New Complaint</button>
                        <Reports
                            showCities = {false}
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
        uid : state.auth.uid,
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