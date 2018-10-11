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
import './ReportComplaint.css';

const styles = theme => {
    return {
        TextFields : {
            marginBottom : "20px",
            width : "95%"
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

class ReportComplaint extends Component{
 
    state = {
        city: 'karachi',
        area : '',
        type : '',
        time : '',
        description : '',
        against : '',
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
        const {city,area,type,time,description,against} = this.state;
        // this.props.uid
        const date = new Date().getTime();
        database.ref('complaints/').push({
            city,
            area,
            type,
            time,
            description,
            against,
            reportedAt : date,
            reportedBy : "123"
        })
        .then(res => {
            this.setState({
                loading : false,
                error : null,
                city: 'karachi',
                area : '',
                type : '',
                time : '',
                description : '',
                against : '',});
        })
        .catch(err => {
            this.setState({loading : false, error : err});
        })
    }



    render(){
        return(
     <div  className = "Main">
            <p className="h2 heading font-weight-bold">Report Complaint</p>
            {!this.state.loading ?
                <Card>
                    <p className = "Error">{this.state.error ? this.state.error  : null}</p>
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
                    <ValidatorForm
                        ref="form"
                        onSubmit={this.handleSubmit}
                        onError={errors => console.log(errors)}
                    >
                        <TextValidator
                            className = {this.props.classes.TextFields}
                            label="Area"
                            onChange={this.handleChange}
                            name="area"
                            value={this.state.area}
                            validators={['required']}
                            errorMessages={['This field is required']}
                        /><br/>
                        <TextValidator
                            className = {this.props.classes.TextFields}
                            label="Type"
                            onChange={this.handleChange}
                            name="type"
                            value={this.state.type}
                            validators={['required', 'isSmallEnough']}
                            errorMessages={['This field is required', 'Only 256 Characters are allowed']}
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
                        <TextValidator
                            className = {this.props.classes.TextFields}
                            label="Breif Description"
                            onChange={this.handleChange}
                            name="description"
                            value={this.state.description}
                            validators={['required', 'isSmallEnough']}
                            errorMessages={['This field is required', 'Only 256 Characters are allowed']}
                        /><br/>
                        <TextValidator
                            className = {this.props.classes.TextFields}
                            label="Against"
                            onChange={this.handleChange}
                            name="against"
                            value={this.state.against}
                            validators={['required', 'isSmallEnough']}
                            errorMessages={['This field is required', 'Only 256 Characters are allowed']}
                        /><br/>
                        <Button type="submit" variant="contained" color="secondary" className = "button">
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
        isSignup : state.auth.isSignup
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

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(ReportComplaint));