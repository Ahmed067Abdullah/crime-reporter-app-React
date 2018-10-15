import React, {Component} from 'react';
import * as firebase from 'firebase';

import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Card from '../../../hoc/Card/Card';
import {sliceTime} from '../../../Utils/Utility';

// MUI imports start
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
// MUI imports start

const styles = theme => {
    return {
        TextFields : {
            marginBottom : "20px",
            width : "95%"
        },
        button: {
            backgroundColor : "#374F6B",
            color : "white",
            margin : "0px auto"
        },
        formControl: {
            margin : "20px auto",
            marginLeft : "3%",
            width: "95%",  
        }
    }
}


class SingleMissingPerson extends Component{
    
    state = {
        age : '',
        city: '',
        appearance : '',
        condition : '',
        location : '',
        name : '',
        time : '',
        reportedBy : '',
        reportedAt : '',
        reporterId : '',
        status : '',
        reason : '',
        finalResponseAt : '',
        updatedReason : '',
        updatedStatus : '',
        id : '',
        imgURL : ''
    }

    componentDidMount() {
        firebase.database().ref(`missingPersons/${this.props.match.params.id}`).on('value', snapshot => {
            const res = snapshot.val();
            this.setState({
                age : res.age,
                city: res.city,
                appearance : res.appearance,
                condition : res.condition,
                location : res.location,
                name : res.name,
                time : res.time,
                reportedBy : res.reportedBy,
                reportedAt : res.reportedAt,
                reporterId : res.reporterId,
                reason :res.reason ? res.reason : '',
                updatedReason : res.reason ? res.reason : '',
                finalResponseAt : res.finalResponseAt ? res.finalResponseAt : '',
                status : res.status,
                imgURL : res.imgURL,
                updatedStatus : res.status,
                id : this.props.match.params.id
            })
        })
    }
    
    handleChange = (event) => {
        this.setState({ [event.target.name] : event.target.value });
    }

    handleSubmit = () => {
        if(!(this.state.updatedStatus === 'Canceled' && this.state.updatedReason.trim() === '')){
            let reason = this.state.updatedStatus === 'Canceled' ? this.state.updatedReason : ''
            let finalResponseAt = this.state.updatedStatus === 'Canceled' || this.state.updatedStatus === 'Satisfied' ? new Date().getTime() : ''
            const status = {}
            status[`missingPersons/${this.state.id}/status`] = this.state.updatedStatus;
            status[`missingPersons/${this.state.id}/reason`] = reason;
            status[`missingPersons/${this.state.id}/finalResponseAt`] = finalResponseAt;
            firebase.database().ref().update(status);
            // this.back();
        }
    }

    back = () => {
        this.props.history.push('/missingPersons');
    }


    render(){
        let time = sliceTime(this.state.time)        
        let reportedAt = sliceTime(this.state.reportedAt)
        
        let reason = null;
        let finalResponse = null;
        if(this.state.reason) 
            reason = <Aux><strong>Reason</strong> : {this.state.reason}<br/></Aux>
        if(this.state.finalResponseAt){
            let finalResponseAt = sliceTime(this.state.finalResponseAt) 
            finalResponse = <Aux><strong>{this.state.status ===  "Canceled" ? "Canceled" : "Satisfied"} At</strong> : {finalResponseAt}</Aux>
        }
        return(
            <div className = {this.props.classes.Main}>
                {this.state.city ?  
                <div className = "singles-card">
                    <Card>
                        <a href = {this.state.imgURL} rel="noopener noreferrer" target = "_blank">
                            <img src = {this.state.imgURL} className = "card-image" alt = "img"/>
                        </a>
                        <div className = "card-text">
                            <strong>Reported By</strong> : {this.state.reportedBy}<br/>
                            <strong>Reported At</strong> : {reportedAt}<br/>
                            <strong>Age</strong> : {this.state.age}<br/>
                            <strong>Appearance</strong> : {this.state.appearance}<br/>
                            <strong>Mental Condition</strong> : {this.state.condition}<br/>
                            <strong>Last Known Location</strong> : {this.state.location}<br/>
                            <strong>Last Seen At</strong> : {time}<br/>
                            <strong>City</strong> : {this.state.city}<br/>
                            <strong>Status</strong> : {this.state.status}<br/>
                            {reason}
                            {finalResponse}
                        </div>
                    </Card>
                    <FormControl className={this.props.classes.formControl}>
                        <InputLabel htmlFor="bg">Update Status</InputLabel>
                        <Select
                            value={this.state.updatedStatus}
                            onChange={this.handleChange}
                            inputProps={{
                                name: 'updatedStatus',
                                id: 'bg',
                            }}>
                            <MenuItem value={"Pending"}>Pending</MenuItem>
                            <MenuItem value={"Working"}>Working</MenuItem>
                            <MenuItem value={"Satisfied"}>Satisfied</MenuItem>
                            <MenuItem value={"Canceled"}>Canceled</MenuItem>
                        </Select>
                    </FormControl><br/>

                    <ValidatorForm
                        ref="form"
                        onSubmit={this.handleSubmit}
                        onError={errors => console.log(errors)}>
                        {this.state.updatedStatus === 'Canceled' ? 
                            <TextValidator
                                className = {this.props.classes.TextFields}
                                label="Reason"
                                onChange={this.handleChange}
                                name="updatedReason"
                                value={this.state.updatedReason}
                                validators={['required', 'isSmallEnough']}
                                errorMessages={['This field is required', 'Only 256 Characters are allowed']}/> :
                            null}
                        <br/>

                        <Button 
                            variant="contained" 
                            className = "btn btn-info my-reports-button single-button" 
                            onClick = {this.back}>Back</Button>

                        <Button 
                            type="submit" 
                            variant="contained" 
                            className = "btn btn-info my-reports-button single-button" 
                            onClick = {this.handleSubmit}>Save</Button>
                    </ValidatorForm>
                </div>
                 : null
            } 
            </div>
        )
    }
}

export default withStyles(styles)(SingleMissingPerson);