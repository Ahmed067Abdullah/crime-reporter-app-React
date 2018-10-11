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

class MissingPersons extends Component{
    state = {
        city : '',
        loading : false
    }

    componentDidMount(){
        if(this.props.location.pathname === '/myMissingPersons'){
            this.setState({ loading : true });
            firebase.database().ref('/missingPersons').orderByChild('reporterId').equalTo(`${this.props.uid}`).on('value' , snapshot => {
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
        firebase.database().ref('/missingPersons').orderByChild('city').equalTo(`${city}`).on('value' , snapshot => {
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
        this.props.history.push("/reportMissingPerson")
    }
    
    render(){
        const missingPersonsPage = this.props.location.pathname === '/missingPersons';
        let reports = '';
        if(this.state.city === '' && missingPersonsPage)
            reports = <p className = "search-messsage">Please Select a City to Continue</p>
        else if(this.props.reports.length <= 0){
            let msg = "You Haven't Reported Any Missing Persons Yet"
            if(missingPersonsPage)
                msg = "No Missing Persons Reports Found For The Selected City"
            reports = <p className = "search-messsage">{msg}</p>
        }    
        else{
            reports = (
                <div className = "reports-container">
                    {this.props.reports.map(report => {
                        return(
                            <div className = "card-container missing-persons-card" key = {report.id}>
                                <Card>
                                    <strong>Reported By</strong> : {report.reportedBy}<br/>
                                    <strong>Reported At</strong> : {report.reportedAt}<br/>
                                    <strong>Name</strong> : {report.name}<br/>
                                    <strong>Age</strong> : {report.age}<br/>
                                    <strong>Appearance</strong> : {report.appearance}<br/>
                                    <strong>Mental Condition</strong> : {report.condition}<br/>  
                                    <strong>Last Known Location</strong> : {report.location}<br/>
                                    <strong>When</strong> : {report.time}<br/>
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
                            onClick = {this.clickedHandler}
                            disabled = {!this.props.isRegistered}>Report Missing Person</button>
                        <Reports
                            showCities = {missingPersonsPage}
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
        isRegistered : state.auth.isRegistered
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onSetReports : (reports) => dispatch(actions.setReports(reports))
    }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(MissingPersons));