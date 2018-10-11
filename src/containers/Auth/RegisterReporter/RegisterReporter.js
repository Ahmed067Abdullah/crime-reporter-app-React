import React, {Component} from 'react';
import * as firebase from 'firebase';
import {connect} from 'react-redux';

import Spinner from '../../../components/UI/Spinner/Spinner';
import * as actions from '../../../store/actions/index';
import Card from '../../../hoc/Card/Card';
import './RegisterReporter.css';

// Material UI Imports start
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { withStyles } from "@material-ui/core/styles";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
// Material UI Imports ens

const styles = theme => {
    return {
        TextFields : {
            marginBottom : "10px",
            marginTop : "10px",
            width : "95%"
        },
        LastTextField : {
            marginBottom : "10px",
            marginTop : "-10px",
            width : "95%"
        },
        Button : {
            backgroundColor : "#374F6B",
            color : "white"
        }
    }
}

class RegisterDonor extends Component{
    state = {
        phone : '',
        age : '',
        city : 'karachi',
        cnic : '',
        name : '',
        loading : false,
        error : null
    }

    componentDidMount() {
        ValidatorForm.addValidationRule('isSmallEnough', (value) => {
            if (value.trim().length >= 256) {
                return false;
            }
            return true;
        });

        ValidatorForm.addValidationRule('isElevenDigits', (value) => {
            if (value.trim().length < 11 || value.trim().length > 11  ) {
                return false;
            }
            return true;
        });

        ValidatorForm.addValidationRule('have13Digits', (value) => {
            if (value.trim().length < 13 || value.trim().length > 13  ) {
                return false;
            }
            return true;
        });

        if(this.props.isRegistered){
            firebase.database().ref(`reporters/${this.props.uid}`).once('value')
                .then(snapshot =>{
                    this.setState({
                        name : snapshot.val().name,
                        age :  snapshot.val().age,
                        phone : snapshot.val().phone,
                        cnic : snapshot.val().cnic,
                        city : snapshot.val().city
                    })
                })
        }
    }
    handleChange = (event) => {
        this.setState({ [event.target.name] : event.target.value });
    }
 
    handleSubmit = () => {
        this.setState({loading : true});
        const database = firebase.database();
        const {name,age,city,phone,cnic} = this.state;
        database.ref(`reporters/${this.props.uid}`).set({
            name,
            age,
            city,
            phone,    
            cnic
        })
        .then(res => {
            this.setState({loading : false, error : null});
            alert("Congratulations! You're Successfully Registered.")
            this.props.onSetRegistered(name);
        })
        .catch(err => {
            this.setState({loading : false, error : err});
        })
    }
    render(){
        return(
            <div  className = "Main">
            <p className="h2 heading font-weight-bold">Register as Reporter</p>
            {this.state.loading ? <Spinner/> : 
            <Card>
                <p className = "Error">{this.state.error ? this.state.error  : null}</p>                
                <ValidatorForm
                    ref="form"
                    onSubmit={this.handleSubmit}
                    onError={errors => console.log(errors)}>
                    
                    <TextValidator
                        className = {this.props.classes.TextFields}
                        label="Name"
                        onChange={this.handleChange}
                        name="name"
                        value={this.state.name}
                        validators={['required','isSmallEnough']}
                        errorMessages={['This field is required', 'Maximum 255 Characters are allowed']}/><br/>
                    
                    <TextValidator
                        className = {this.props.classes.TextFields}
                        label="CNIC"
                        onChange={this.handleChange}
                        name="cnic"
                        value={this.state.cnic}
                        validators={['required','have13Digits']}
                        errorMessages={['This field is required', 'CNIC must have 13 digits']}/><br/>

                    <TextValidator
                        className = {this.props.classes.TextFields}
                        label="Phone Number"
                        onChange={this.handleChange}
                        name="phone"
                        value={this.state.phone}
                        validators={['required','matchRegexp:^[0-9]*$','isElevenDigits']}
                        errorMessages={['This field is required', 'Invalid Phone Number','Phone Number must have 11 digits']}/><br/><br/>
                    
                    <TextValidator
                        className = {this.props.classes.LastTextField}
                        label="Age"
                        onChange={this.handleChange}
                        name="age"
                        value={this.state.age}
                        validators={['required','matchRegexp:^[0-9]*$']}
                        errorMessages={['This field is required','Invalid Age']}/><br/>
                        
                    <FormControl className = {this.props.classes.TextFields}>
                        <InputLabel htmlFor="bg">City</InputLabel>
                        <Select
                            value={this.state.city}
                            onChange={this.handleChange}
                            inputProps={{
                                name: 'city',
                                id: 'bg',
                            }}>
                            <MenuItem value={"karachi"}>Karachi</MenuItem>
                            <MenuItem value={"lahore"}>Lahore</MenuItem>
                            <MenuItem value={"faisalabad"}>Faisalabad</MenuItem>
                            <MenuItem value={"hyderabad"}>Hyderabad</MenuItem>
                            <MenuItem value={"islamabad"}>Islamabad</MenuItem>
                            <MenuItem value={"gujranwala"}>Gujranwala</MenuItem>
                            <MenuItem value={"multan"}>Multan</MenuItem>
                            <MenuItem value={"peshawar"}>Peshawar</MenuItem>
                            <MenuItem value={"quettaB"}>Quetta</MenuItem>
                            <MenuItem value={"bahawalpur"}>Bahawalpur</MenuItem>
                        </Select>
                    </FormControl><br/>  

                    <Button className = {this.props.classes.Button} type="submit">{this.props.isRegistered ? "Update" : "Register"}</Button>
                </ValidatorForm>
            </Card>}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return{
        uid : state.auth.uid,
        isRegistered : state.auth.isRegistered
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onSetRegistered : (uname) => dispatch(actions.registeredReporter(uname))        
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(RegisterDonor));