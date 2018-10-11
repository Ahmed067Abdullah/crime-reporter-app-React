import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import * as firebase from 'firebase'

import Card from '../../../hoc/Card/Card';
import Spinner from '../../../components/UI/Spinner/Spinner';
import './ReportMissingPerson.css';

const styles = theme => {
    return {
        TextFields : {
            marginBottom : "20px",
            width : "95%"
        },
        button: {
            margin: theme.spacing.unit,
            marginBottom : "15px"
        },
        formControl: {
            marginBottom : "20px",
            width: "95%",
        },
        file :{
            marginTop : "5px"
        }
    }
}

class ReportMissingPerson extends Component{
 
    state = {
        name : '',
        age : '',
        city: 'karachi',
        location : '',
        appearance : '',
        time : '',
        condition : '',
        error : '',
        loading : false
    }
 
    componentDidMount() {
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
        this.setState({loading : true});
        const database = firebase.database();
        const {name, age, city, location, appearance, time, condition,} = this.state;
        const date = new Date().getTime();
        database.ref('missingPersons/').push({
            name,
            age,
            city,
            location,
            appearance,
            time,
            condition,
            reportedAt : date,
            reportedBy : this.props.uname,
            reporterId : this.props.uid,
            status : "Pending"
        })
        .then(res => {
            this.setState({
                loading : false,
                error : null, 
                name : '',
                age : '',
                city: 'karachi',
                location : '',
                appearance : '',
                time : '',
                condition : ''
            });
            alert("Report Submitted Successfully");
        })
        .catch(err => {
            this.setState({loading : false, error : err});
        })
    }



    render(){
        return(
     <div  className = "Main">
            <p className="h2 heading font-weight-bold">Report Missing Person</p>
            {!this.state.loading ?
                <Card>
                    <p className = "Error">{this.state.error ? this.state.error  : null}</p>
                    <ValidatorForm
                        ref="form"
                        onSubmit={this.handleSubmit}
                        onError={errors => console.log(errors)}
                    >
                        <TextValidator
                            className = {this.props.classes.TextFields}
                            label="Name"
                            onChange={this.handleChange}
                            name="name"
                            value={this.state.name}
                            validators={['required', 'isSmallEnough']}
                            errorMessages={['This field is required', 'Only 256 Characters are allowed']}
                        /><br/>
                        <TextValidator
                            className = {this.props.classes.TextFields}
                            label="Age"
                            onChange={this.handleChange}
                            name="age"
                            value={this.state.age}
                            validators={['required','matchRegexp:^[0-9]*$']}
                            errorMessages={['This field is required','Invalid Age']}
                        /><br/>
                        <TextValidator
                            className = {this.props.classes.TextFields}
                            label="Appearance"
                            onChange={this.handleChange}
                            name="appearance"
                            value={this.state.appearance}
                            validators={['required','isSmallEnough']}
                            errorMessages={['This field is required','Only 256 Characters are allowed']}
                        /><br/>
                        <TextValidator
                            className = {this.props.classes.TextFields}
                            label="Mental Condition"
                            onChange={this.handleChange}
                            name="condition"
                            value={this.state.condition}
                            validators={['required', 'isSmallEnough']}
                            errorMessages={['This field is required', 'Only 256 Characters are allowed']}
                        /><br/>
                        <TextValidator
                            className = {this.props.classes.TextFields}
                            label="Last Known Location"
                            onChange={this.handleChange}
                            name="location"
                            value={this.state.location}
                            validators={['required','isSmallEnough']}
                            errorMessages={['This field is required','Only 256 Characters are allowed']}
                        /><br/>
                        <TextValidator
                            className = {this.props.classes.TextFields}
                            label="When"
                            onChange={this.handleChange}
                            name="time"
                            value={this.state.time}
                            validators={['required', 'isSmallEnough']}
                            errorMessages={['This field is required', 'Only 256 Characters are allowed']}
                        /><br/>
                        <FormControl className={this.props.classes.formControl}>
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
                        <label>Picture (If any) <input type = "file" className = {this.props.classes.file}/></label><br/>
                        <Button type="submit" variant="contained" color="secondary" className="button">
                            Post
                        </Button>
                    </ValidatorForm>
                </Card> : <div  className = "auth-spinner"><Spinner/></div>}           
            </div>
        )
    }
    }

const mapStateToProps = state => {
    return{
        isAuth : state.auth.isAuth,
        isSignup : state.auth.isSignup,
        uid : state.auth.uid,
        uname : state.auth.uname
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onLogin : (uid) => dispatch(actions.login(uid)),
        onLogout : () => dispatch(actions.logout()),
        onSignin : () => dispatch(actions.setSignin()),
        onSignup : () => dispatch(actions.setSignup())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(ReportMissingPerson));