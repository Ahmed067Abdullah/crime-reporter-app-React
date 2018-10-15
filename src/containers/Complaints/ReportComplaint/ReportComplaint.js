import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as firebase from 'firebase';

import * as actions from '../../../store/actions/index';
import Card from '../../../hoc/Card/Card';
import Spinner from '../../../components/UI/Spinner/Spinner';
import './ReportComplaint.css';

// MUI imports start
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withStyles } from "@material-ui/core/styles";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import DialogWindow from '../../../components/UI/DialogWindow/DialogWindow';
// MUI imports end

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
        },
    }
}

class ReportComplaint extends Component{
 
    constructor(){
        super();
        this.date = new Date();
        this.state = {
            city: 'karachi',
            area : '',
            type : 'burglary',
            time : `${this.date.getFullYear()}-${this.date.getMonth() + 1}-${this.date.getDate()}T${this.date.getHours()}:${this.date.getMinutes()}`,
            description : '',
            against : '',
            error : '',
            loading : false,
            isSubmitted : false
        }
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
        if(new Date(this.state.time).getTime() < new Date().getTime()){
            this.setState({loading : true});
            const database = firebase.database();
            const {city,area,type,time,description,against} = this.state;
            const date = new Date().getTime();
            database.ref('complaints/').push({
                city,
                area,
                type,
                time,
                description,
                against,
                reportedAt : date,
                reportedBy : this.props.uname,
                reporterId : this.props.uid,
                status : "Pending"
            })
            .then(res => {
                this.date = new Date();
                this.setState({
                    loading : false,
                    error : null,
                    city:  this.state.city,
                    area : '',
                    type : 'burglary',
                    time : `${this.date.getFullYear()}-${this.date.getMonth() + 1}-${this.date.getDate()}T${this.date.getHours()}:${this.date.getMinutes()}`,
                    description : '',
                    against : '',
                    isSubmitted : true,
                });
            })
            .catch(err => {
                this.setState({loading : false, error : err});
            })
        }
        else{
            alert("Invalid Time")
        }
    }

    back = () => {
        this.props.history.push('/complaints');
    }

    more = () => {
        this.setState({isSubmitted : false});
    }

    render(){
        return(
            <div  className = "Main">
                <p className="h2 heading font-weight-bold">Report Complaint</p>
                {this.state.isSubmitted ? <DialogWindow back = {this.back} more = {this.more}/> : null}
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
                        onError={errors => console.log(errors)}>
                        <TextValidator
                            className = {this.props.classes.TextFields}
                            label="Area"
                            onChange={this.handleChange}
                            name="area"
                            value={this.state.area}
                            validators={['required', 'isSmallEnough']}
                            errorMessages={['This field is required', 'Only 256 Characters are allowed']}
                        /><br/>

                        <FormControl className={this.props.classes.formControl}>
                            <InputLabel htmlFor="bg">Type</InputLabel>
                            <Select
                                value={this.state.type}
                                onChange={this.handleChange}
                                inputProps={{
                                    name: 'type',
                                    id: 'bg',
                                }}>
                                <MenuItem value={"burglary"}>Burglary</MenuItem>
                                <MenuItem value={"domestic"}>Domestic Violance</MenuItem>
                                <MenuItem value={"bribery"}>Bribery</MenuItem>
                                <MenuItem value={"blackmail"}>Blackmail</MenuItem>
                                <MenuItem value={"fraud"}>Fraud</MenuItem>
                                <MenuItem value={"other"}>Other</MenuItem>
                            </Select>
                        </FormControl><br/>

                        <TextField
                            id="datetime-local"
                            label="When it Happened"
                            onChange={this.handleChange}
                            name = "time"
                            type="datetime-local"
                            defaultValue={`${this.date.getFullYear()}-${this.date.getMonth() + 1}-${this.date.getDate()}T${this.date.getHours()}:${this.date.getMinutes()}`}
                            className={this.props.classes.TextFields}
                            InputLabelProps={{
                                shrink: true,
                            }}/><br/>
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
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="secondary" 
                            className = "button">Post</Button>
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

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(ReportComplaint));