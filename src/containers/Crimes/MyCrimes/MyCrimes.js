import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import * as firebase from 'firebase';
import {connect} from 'react-redux';

import '../../../Utils/Utility.css';
import Reports from '../../../components/Reports/Reports';
import * as actions from '../../../store/actions/index';
import Card from '../../../hoc/Card/Card';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Aux from '../../../hoc/Auxiliary/Auxiliary';

class Crimes extends Component{
    state = {
        loading : false
    }

    componentDidMount(){
        this.setState({ loading : true });
        firebase.database().ref('/crimes').orderByChild('reporterId').equalTo(`${this.props.uid}`).on('value' , snapshot => {
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
        this.props.history.push("/reportCrime")
    }

    render(){
        let reports = '';
        if(this.props.reports.length <= 0){
            reports = <p className = "search-messsage">You Haven't Reported Any Crime Reports Yet</p>
        }    
        else{
            reports = (
                <div className = "reports-container">
                    {this.props.reports.map(report => {
                        let reportedAt = new Date(report.reportedAt).toString();
                        reportedAt = reportedAt.slice(0,reportedAt.length - 34);                        
                        return(
                            <div className = "card-container" key = {report.id} onClick = {this.props.isAdmin ? () => this.props.history.push(`/singleCrime/${report.id}`) : null}>
                                <Card>
                                    <strong>Reported By</strong> : {report.reportedBy}<br/>
                                    <strong>Reported At</strong> : {reportedAt}<br/>
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
                            className = {"btn btn-info my-reports-button"} 
                            onClick = {this.clickedHandler}
                            disabled = {!this.props.isRegistered}>Report New Crime</button>
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

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Crimes));