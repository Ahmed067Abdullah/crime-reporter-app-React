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

class Crimes extends Component{
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
                    let query = firebase.database().ref('/crimes').orderByChild('city').equalTo(this.state.city)
                    if(this.state.city === 'all')
                        query = firebase.database().ref('/crimes')
    
                    query.on('value' , snapshot => {
                        const crimesObj = snapshot.val();
                        let crimes = [];
                        for(let key in crimesObj){
                            if(crimesObj[key].status === this.state.status ||  this.state.status === 'all')
                                crimes.push({id : key ,...crimesObj[key]})
                        }
                        this.props.onSetReports(crimes);
                        this.setState({ loading : false});
                    });
                }
            });
        }
        else{
            this.setState({ [event.target.name] : value, loading : true });
            firebase.database()
                .ref('/crimes')
                .orderByChild('city')
                .equalTo(value)
                .on('value' , snapshot => {
                    const crimesObj = snapshot.val();
                    let crimes = [];
                    for(let key in crimesObj){
                        crimes.push({id : key ,...crimesObj[key]})
                    }
                    this.props.onSetReports(crimes);
                    this.setState({ loading : false});
                });
        }
    }

    clickedHandler = () => {
        this.props.history.push("/reportCrime")
    }

    render(){
        let reports = '';
        if((this.props.isAdmin && (this.state.city === '' || this.state.status === '')) 
            || this.state.city === '')
            reports = <p className = "search-messsage">Please Select {this.props.isAdmin ? "City and Status to Search" : "a City to Continue"}</p>
        else if(this.props.reports.length <= 0){
            reports = <p className = "search-messsage">No Crime Reports Found For The Selected {this.props.isAdmin ? "Combination" : "City"}</p>
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
                            reason = <Aux><strong>Reason</strong> : {report.reason}<br/></Aux>
                        if(report.finalResponseAt){
                            let finalResponseAt = sliceTime(report.finalResponseAt)
                            finalResponse = <Aux><strong>{report.status ===  "Canceled" ? "Canceled" : "Satisfied"} At</strong> : {finalResponseAt}</Aux>
                        }
                        return(
                            <div 
                                className = "card-container" 
                                key = {report.id} 
                                onClick = {this.props.isAdmin ? () => this.props.history.push(`/singleCrime/${report.id}`) : null}>
                                <Card>
                                    <a href = {report.imgURL} rel="noopener noreferrer" target = "_blank">
                                        <img src = {report.imgURL} className = "card-image" alt = "img"/>
                                    </a>
                                    <div className = "card-text">
                                        <strong>Reported By</strong> : {report.reportedBy}<br/>
                                        <strong>Reported At</strong> : {reportedAt}<br/>
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
        if(!this.props.isAuth && !this.props.isAdmin){
            registerationMsg = <p className = "reg-warning">Please Login to Explore Complete Application</p>
        } 
        else if(!this.props.isRegistered && !this.props.isAdmin){
            registerationMsg = <p className = "reg-warning">Please Register as Reporter to Report Crimes</p>
        }   
        return(
            <div>
                {!this.state.loading ?  
                    <Aux>
                        {registerationMsg}
                        <button 
                            className = "btn btn-info my-reports-button" 
                            onClick = {this.clickedHandler}
                            disabled = {!this.props.isRegistered}>Report New Crime</button>
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

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Crimes));