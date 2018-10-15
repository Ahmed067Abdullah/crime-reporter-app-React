import React, {Component} from 'react';
import * as firebase from 'firebase';

import Card from '../../../hoc/Card/Card';

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
        updatedStatus : '',
        id : '',
        imgURL : ''
    }

    componentDidMount() {
        firebase.database().ref(`missingPersons/${this.props.match.params.id}`).on('value', snapshot => {
            this.setState({
                age : snapshot.val().age,
                city: snapshot.val().city,
                appearance : snapshot.val().appearance,
                condition : snapshot.val().condition,
                location : snapshot.val().location,
                name : snapshot.val().name,
                time : snapshot.val().time,
                reportedBy : snapshot.val().reportedBy,
                reportedAt : snapshot.val().reportedAt,
                reporterId : snapshot.val().reporterId,
                reason : snapshot.val().reason ? snapshot.val().reason : '',
                status : snapshot.val().status,
                imgURL : snapshot.val().imgURL,
                updatedStatus : snapshot.val().status,
                id : this.props.match.params.id
            })
        })
    }
    
    handleChange = (event) => {
        this.setState({ [event.target.name] : event.target.value });
    }

    handleSubmit = () => {
        if(!(this.state.updatedStatus === 'Canceled' && this.state.reason === '')){
            let reason = this.state.updatedStatus === 'Canceled' ? this.state.reason : ''
            const status = {}
            status[`missingPersons/${this.state.id}/status`] = this.state.updatedStatus;
            status[`missingPersons/${this.state.id}/reason`] = reason;
            firebase.database().ref().update(status);
        }
    }

    render(){
        let reportedAt = new Date(this.state.reportedAt).toString();
        reportedAt = reportedAt.slice(0,reportedAt.length - 34);  
        
        let reason = null 
        if(this.state.reason) 
            reason = <p><strong>Reason</strong> : {this.state.reason}</p>

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
                            <strong>Last Seen At</strong> : {this.state.time}<br/>
                            <strong>City</strong> : {this.state.city}<br/>
                            <strong>Status</strong> : {this.state.status}<br/>
                            {reason}
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
                                name="reason"
                                value={this.state.reason}
                                validators={['required', 'isSmallEnough']}
                                errorMessages={['This field is required', 'Only 256 Characters are allowed']}/> :
                            null}
                        <br/>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            className={this.props.classes.button} 
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