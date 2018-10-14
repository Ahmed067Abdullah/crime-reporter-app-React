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


class SingleCrime extends Component{
    
    state = {
        city: '',
        area : '',
        type : '',
        time : '',
        description : '',
        reportedBy : '',
        reportedAt : '',
        reporterId : '',
        status : '',
        updatedStatus : '',
        reason : '',
        id : '',
        imgURL : ''
    }

    componentDidMount() {
        firebase.database().ref(`crimes/${this.props.match.params.id}`).on('value', snapshot => {
            this.setState({
                city: snapshot.val().city,
                area : snapshot.val().area,
                type : snapshot.val().type,
                time : snapshot.val().time,
                description : snapshot.val().description,
                reportedBy : snapshot.val().reportedBy,
                reportedAt : snapshot.val().reportedAt,
                reporterId : snapshot.val().reporterId,
                reason : snapshot.val().reason ? snapshot.val().reason : '',
                status : snapshot.val().status,
                imgURL : snapshot.val().imgURL,
                updatedStatus : snapshot.val().status,
                id : this.props.match.params.id,
            })
        })

        ValidatorForm.addValidationRule('isSmallEnough', (value) => {
            if (value.trim().length >= 256) {
                return false;
            }
            return true;
        });
    }
    
    handleChange = (event) => {
        this.setState({ [event.target.name] : event.target.value });
    }

    handleSubmit = () => {
        if(!(this.state.updatedStatus === 'Canceled' && this.state.reason.trim() === '')){
            const status = {}
            status[`crimes/${this.state.id}/status`] = this.state.updatedStatus;
            status[`crimes/${this.state.id}/reason`] = this.state.reason;
            firebase.database().ref().update(status);
        }
    }

    render(){
        let reportedAt = new Date(this.state.reportedAt).toString();
        reportedAt = reportedAt.slice(0,reportedAt.length - 34);     
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
                            <strong>Type</strong> : {this.state.type}<br/>
                            <strong>Description</strong> : {this.state.description}<br/>
                            <strong>When</strong> : {this.state.time}<br/>
                            <strong>Area</strong> : {this.state.area}<br/>  
                            <strong>City</strong> : {this.state.city}<br/>
                            <strong>Status</strong> : {this.state.status}<br/>
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

export default withStyles(styles)(SingleCrime);