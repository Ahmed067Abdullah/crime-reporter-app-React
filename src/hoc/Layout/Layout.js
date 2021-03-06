import React, {Component} from 'react';
import {Route, Switch, withRouter, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import Navbar from '.././../components/UI/Navbar/Navbar';
import Aux from '../../hoc/Auxiliary/Auxiliary';

// component imports for routing
import Auth from '../../containers/Auth/Auth';
import RegisterReporter from '../../containers/Auth/RegisterReporter/RegisterReporter';
import Logout from '../../containers/Auth/Logout/Logout';

import Crimes from '../../containers/Crimes/Crimes';
import Complaints from '../../containers/Complaints/Complaints';
import MissingPersons from '../../containers/MissingPersons/MissingPersons';

import ReportCrime from '../../containers/Crimes/ReportCrime/ReportCrime';
import ReportComplaint from '../../containers/Complaints/ReportComplaint/ReportComplaint';
import ReportMissingPerson from '../../containers/MissingPersons/ReportMissingPerson/ReportMissingPerson';

import SingleCrime from '../../containers/Crimes/SingleCrime/SingleCrime';
import SingleComplaint from '../../containers/Complaints/SingleComplaint/SingleComplaint';
import SingleMissingPerson from '../../containers/MissingPersons/SingleMissingPerson/SingleMissingPerson';

import MyMissingPersons from '../../containers/MissingPersons/MyMissingPersons/MyMissingPersons';
import MyCrimes from '../../containers/Crimes/MyCrimes/MyCrimes';
import MyComplaints from '../../containers/Complaints/MyComplaints/MyComplaints';

class Layout extends Component{
    render(){
        let routes = (
            <Switch>
                <Route path = "/auth" component = {Auth}/>
                <Route path = "/crimes" component = {Crimes}/>
                <Route path = "/missingPersons" component = {MissingPersons}/>
                <Route path = "/" exact component = {Auth}/>
                <Redirect to = "/auth"/>
            </Switch>            
        )
        if(this.props.isAdmin){
            routes = (
                <Switch>
                    <Route path = "/auth" component = {Auth}/>
                    <Route path = "/crimes" component = {Crimes}/>
                    <Route path = "/complaints" component = {Complaints}/>
                    <Route path = "/missingPersons" component = {MissingPersons}/>
                    <Route path = "/singleCrime/:id" component = {SingleCrime}/>
                    <Route path = "/singleComplaint/:id" component = {SingleComplaint}/>
                    <Route path = "/singleMissingPerson/:id" component = {SingleMissingPerson}/>
                    <Route path = "/logout" component = {Logout}/>
                    <Route path = "/" exact component = {Crimes}/>
                    <Redirect to = "/"/>
                </Switch>
            )
        }
        else if(this.props.isAuth){
            routes = ( 
            <Switch>
                <Route path = "/auth" component = {Auth}/>
                <Route path = "/register" component = {RegisterReporter}/>
                <Route path = "/crimes" component = {Crimes}/>
                <Route path = "/complaints" component = {Complaints}/>
                <Route path = "/missingPersons" component = {MissingPersons}/>
                <Route path = "/myCrimes" component = {MyCrimes}/>
                <Route path = "/myComplaints" component = {MyComplaints}/>
                <Route path = "/myMissingPersons" component = {MyMissingPersons}/>
                <Route path = "/reportCrime" component = {ReportCrime}/>
                <Route path = "/reportComplaint" component = {ReportComplaint}/>
                <Route path = "/reportMissingPerson" component = {ReportMissingPerson}/>
                <Route path = "/logout" component = {Logout}/>
                <Route path = "/" exact component = {Crimes}/>
                <Redirect to = "/"/>
            </Switch>
            )
        }
        return(
            <Aux>
                 <Navbar/>
                {routes}
            </Aux>    
        )
    }
}

const mapStateToProps = state => {
    return{
        isAuth : state.auth.isAuth,
        isAdmin : state.auth.isAdmin
    }
}

export default withRouter(connect(mapStateToProps)(Layout));