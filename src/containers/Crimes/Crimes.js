import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import * as firebase from 'firebase';
import {connect} from 'react-redux';

import Reports from '../../components/Reports/Reports';
import * as actions from '../../store/actions/index';
import Card from '../../hoc/Card/Card';
import Spinner from './../../components/UI/Spinner/Spinner';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import '../../Utils/Utility.css';

class Crimes extends Component{
    state = {
        city : '',
        loading : false
    }

    handleChange = (event) => {
        const city = event.target.value;
        this.setState({ [event.target.name] : city, loading : true });
        firebase.database().ref('/crimes').orderByChild('city').equalTo(`${city}`).on('value' , snapshot => {
            const complaintsObj = snapshot.val();
            let complaints = [];
            for(let key in complaintsObj){
                complaints.push({id : key ,...complaintsObj[key]})
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
        if(this.state.city === '')
            reports = <p className = "search-messsage">Please Select a City to Continue</p>
        else if(this.props.reports.length <= 0){
            reports = <p className = "search-messsage">No Crime Reports Found For The Selected City</p>
        }    
        else{
            reports = (
                <div className = "reports-container">
                    {this.props.reports.map(report => {
                        let reportedAt = new Date(report.reportedAt).toString();
                        reportedAt = reportedAt.slice(0,reportedAt.length - 34);
                        return(
                            <div 
                                className = "card-container" 
                                key = {report.id} 
                                onClick = {this.props.isAdmin ? () => this.props.history.push(`/singleCrime/${report.id}`) : null}>
                                <Card>
                                    <img src = {report.imgURL} className = "card-image" alt = "img"/>
                                    <div className = "card-text">
                                        <strong>Reported By</strong> : {report.reportedBy}<br/>
                                        <strong>Reported At</strong> : {reportedAt}<br/>
                                        <strong>Type</strong> : {report.type}<br/>
                                        <strong>Description</strong> : {report.description}<br/>
                                        <strong>When</strong> : {report.time}<br/>
                                        <strong>Area</strong> : {report.area}<br/>  
                                        <strong>City</strong> : {report.city}<br/>
                                        <strong>Status</strong> : {report.status}<br/>
                                    </div>
                                </Card>
                            </div> 
                        )
                    })}
                </div>
            )
        }
        let registerationMsg = '';
        if(!this.props.isAuth){
            registerationMsg = <p className = "reg-warning">Please Login to Explore Complete Application</p>
        } 
        else if(!this.props.isRegistered){
            registerationMsg = <p className = "reg-warning">Please Register as Reporter to Report Crimes</p>
        }   
        return(
            <div>
                {!this.state.loading ?  
                    <Aux>
                        {registerationMsg}
                        <button 
                            className = {"btn btn-info my-reports-button"} 
                            onClick = {this.clickedHandler}
                            disabled = {!this.props.isRegistered}>Report New Crime</button>
                        <Reports
                            showCities = {true}
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

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Crimes));