import React, {Component} from 'react';
import * as firebase from 'firebase';

import Card from '../../../hoc/Card/Card';
import Aux from '../../../hoc/Auxiliary/Auxiliary';

// MUI imports start
import {sliceTime} from '../../../Utils//Utility';
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
// MUI imports end

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


class SingleComplaint extends Component{
    
    state = {
        against : '',
        city: '',
        area : '',
        type : '',
        time : '',
        description : '',
        reportedBy : '',
        reportedAt : '',
        reporterId : '',
        status : '',
        finalResponseAt : '',
        updatedStatus : '',
        reason : '',
        updatedReason : '',
        id : ''
    }

    componentDidMount() {
        firebase.database().ref(`complaints/${this.props.match.params.id}`).on('value', snapshot => {
            const res = snapshot.val();
            this.setState({
                against : res.against,
                city: res.city,
                area : res.area,
                type : res.type,
                time : res.time,
                description : res.description,
                reportedBy : res.reportedBy,
                reportedAt : res.reportedAt,
                reporterId : res.reporterId,
                status : res.status,
                reason : res.reason ? res.reason : '',
                updatedReason : res.reason ? res.reason : '',
                finalResponseAt : res.finalResponseAt ? res.finalResponseAt : '',
                updatedStatus : res.status,
                id : this.props.match.params.id
            })
        })

        ValidatorForm.addValidationRule('isSmallEnough', (value) => {
            if (value.trim().length >= 256) {
                return false;
            }
            return true;
        });
    }

    handleSubmit = () => {
        if(!(this.state.updatedStatus === 'Canceled' && this.state.updatedReason.trim() === '')){
            let reason = this.state.updatedStatus === 'Canceled' ? this.state.updatedReason : ''
            let finalResponseAt = this.state.updatedStatus === 'Canceled' || this.state.updatedStatus === 'Satisfied' ? new Date().getTime() : ''
            const status = {}
            status[`complaints/${this.state.id}/status`] = this.state.updatedStatus;
            status[`complaints/${this.state.id}/reason`] = reason;
            status[`complaints/${this.state.id}/finalResponseAt`] = finalResponseAt;
            firebase.database().ref().update(status);
            // this.back();
        }
    }
    
    handleChange = (event) => {
        this.setState({ [event.target.name] : event.target.value });
    }

    back = () => {
        this.props.history.push('/complaints')
    }

    render(){
        let reportedAt = sliceTime(this.state.reportedAt)
        let time = sliceTime(this.state.time)

        let reason = null 
        let finalResponse = null;
        if(this.state.reason ) 
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
                        <div className = "card-text">
                            <strong>Reported By</strong> : {this.state.reportedBy}<br/>
                            <strong>Reported At</strong> : {reportedAt}<br/>
                            <strong>Against</strong> : {this.state.against}<br/>
                            <strong>Type</strong> : {this.state.type}<br/>
                            <strong>Description</strong> : {this.state.description}<br/>
                            <strong>When</strong> : {time}<br/>
                            <strong>Area</strong> : {this.state.area}<br/>  
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

export default withStyles(styles)(SingleComplaint);