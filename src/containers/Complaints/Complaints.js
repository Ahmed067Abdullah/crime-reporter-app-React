import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import * as firebase from 'firebase';
import {connect} from 'react-redux';

import '../../Utils/Utility.css';
import Reports from '../../components/Reports/Reports';
import * as actions from '../../store/actions/index';
import Card from '../../hoc/Card/Card';
import Spinner from './../../components/UI/Spinner/Spinner';
import Aux from '../../hoc/Auxiliary/Auxiliary';

class Complaints extends Component{
    state = {
        city : '',
        loading : false
    }

    componentDidMount(){
        if(this.props.location.pathname === '/myComplaints'){
            this.setState({ loading : true });
            firebase.database().ref('/complaints').orderByChild('reporterId').equalTo(`${this.props.uid}`).on('value' , snapshot => {
                const complaintsObj = snapshot.val();
                let complaints = [];
                for(let key in complaintsObj){
                    complaints.push({id : key, ...complaintsObj[key]})
                }
                this.props.onSetReports(complaints);
                this.setState({ loading : false });
            }); 
        }
    }

    handleChange = (event) => {
        const city = event.target.value;
        this.setState({ [event.target.name] : city, loading : true });
        firebase.database().ref('/complaints').orderByChild('city').equalTo(`${city}`).on('value' , snapshot => {
            console.log(snapshot.val());
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
        const complaintPage = this.props.location.pathname === '/complaints';
        let reports = '';
        if(this.state.city === '' && complaintPage)
            reports = <p className = "search-messsage">Please Select a City to Continue</p>
        else if(this.props.reports.length <= 0){
            let msg = "You Haven't Reported Any Complaints Yet"
            if(complaintPage)
                msg = "No Complaints Found For The Selected City";
            reports = <p className = "search-messsage">{msg}</p>
        }    
        else{
            reports = (
                <div className = "reports-container">
                    {this.props.reports.map(report => {
                        return(
                            <div className = "card-container" key = {report.id} onClick = {this.props.isAdmin ? () => this.props.history.push(`/singleComplaint/${report.id}`) : null}>
                                <Card>
                                    <strong>Reported By</strong> : {report.reportedBy}<br/>
                                    <strong>Reported At</strong> : {report.reportedAt}<br/>
                                    <strong>Against</strong> : {report.against}<br/>
                                    <strong>Type</strong> : {report.type}<br/>
                                    <strong>Description</strong> : {report.description}<br/>
                                    <strong>When</strong> : {report.time}<br/>
                                    <strong>Area</strong> : {report.area}<br/>  
                                    <strong>City</strong> : {report.city}<br/>
                                    <strong>Status</strong> : {report.status}<br/>
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
                            showCities = {complaintPage}
                            handleChange = {this.handleChange}
                            city = {this.state.city}
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