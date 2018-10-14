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

class MissingPersons extends Component{
    state = {
        city : '',
        status : '',
        loading : false
    }

    handleChange = (event,searchKey) => {
        const value = event.target.value;
        this.setState({ [event.target.name] : value, loading : true });
        firebase.database()
            .ref('/missingPersons')
            .orderByChild(searchKey)
            .equalTo(`${value}`)
            .on('value' , snapshot => {
                const missingPersonsObj = snapshot.val();
                let missingPersons = [];
                for(let key in missingPersonsObj){
                    missingPersons.push({id : key, ...missingPersonsObj[key]})
                }
                this.props.onSetReports(missingPersons);
                const conflict = searchKey === 'city' ? 'status' : 'city'; 
                this.setState({ loading : false, [conflict] : '' });
            });
    }

    clickedHandler = () => {
        this.props.history.push("/reportMissingPerson")
    }

    render(){
        let reports = '';
        if(this.state.city === '' && this.state.status === '')
            reports = <p className = "search-messsage">Please Select {this.props.isAdmin ? "an Option to Search" : "a City to Continue"}</p>
        else if(this.props.reports.length <= 0){
            reports = <p className = "search-messsage">No Missing Persons Reports Found For The Selected {this.props.isAdmin ? "Option" : "City"}</p>
        }    
        else{
            reports = (
                <div className = "reports-container">
                    {this.props.reports.map(report => {
                        let reportedAt = new Date(report.reportedAt).toString();
                        reportedAt = reportedAt.slice(0,reportedAt.length - 34);

                        let time = new Date(report.time).toString();
                        time = time.slice(0,time.length - 34);
                        return(
                            <div 
                                className = "card-container missing-persons-card" 
                                key = {report.id} 
                                onClick = {this.props.isAdmin ? 
                                            () => this.props.history.push(`/singleMissingPerson/${report.id}`) : 
                                            null}>
                                <Card>
                                    <a href = {report.imgURL} rel="noopener noreferrer" target = "_blank">
                                        <img src = {report.imgURL} className = "card-image" alt = "img"/>
                                    </a>
                                    <div className = "card-text">
                                        <strong>Reported By</strong> : {report.reportedBy}<br/>
                                        <strong>Reported At</strong> : {reportedAt}<br/>
                                        <strong>Name</strong> : {report.name}<br/>
                                        <strong>Age</strong> : {report.age}<br/>
                                        <strong>Appearance</strong> : {report.appearance}<br/>
                                        <strong>Mental Condition</strong> : {report.condition}<br/>  
                                        <strong>Last Known Location</strong> : {report.location}<br/>
                                        <strong>Last Seen At</strong> : {time}<br/>
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
        if(!this.props.isAuth && !this.props.isAdmin){
            registerationMsg = <p className = "reg-warning">Please Login to Explore Complete Application</p>
        } 
        else if(!this.props.isRegistered && !this.props.isAdmin){
            registerationMsg = <p className = "reg-warning">Please Register as Reporter to Report Missing Persons</p>
        }    
        return(
            <div>
                {!this.state.loading ?  
                    <Aux>
                        {registerationMsg}
                        <button 
                            className = "btn btn-info my-reports-button" 
                            onClick = {this.clickedHandler}
                            disabled = {!this.props.isRegistered}>Report Missing Person</button>
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

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(MissingPersons));