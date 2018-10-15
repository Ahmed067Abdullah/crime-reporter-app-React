import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as firebase from 'firebase'

import * as actions from '../../../store/actions/index';
import Card from '../../../hoc/Card/Card';
import Spinner from '../../../components/UI/Spinner/Spinner';
import './ReportCrime.css';

// MUI imports start
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withStyles } from "@material-ui/core/styles";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DialogWindow from '../../../components/UI/DialogWindow/DialogWindow';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
// MUI imports end

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
        },
    }
}

class ReportCrime extends Component{
 
    constructor(){
        super();
        this.date = new Date();
        this.state = {
            city: 'karachi',
            area : '',
            type : 'snatching',
            time : `${this.date.getFullYear()}-${this.date.getMonth() + 1}-${this.date.getDate()}T${this.date.getHours()}:${this.date.getMinutes()}`,
            description : '',
            error : '',
            loading : false,
            image : null,
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

    fileChangedHandler = (event) => {
        if(event.target.files[0]){
            this.setState({image : event.target.files[0]})
        }
    }

    handleSubmit = () => {
        const {image} = this.state
        if(!image || (image && (image.type === 'image/jpeg' || image.type === 'image/png'))){
            if(new Date(this.state.time).getTime() < new Date().getTime()){
                this.setState({loading : true});
                const database = firebase.database();
                const {city,area,type,time,description} = this.state;
                const date = new Date().getTime();
                database.ref('crimes/').push({
                    city,
                    area,
                    type,
                    time,
                    description,
                    reportedAt : date,
                    reportedBy : this.props.uname,
                    reporterId : this.props.uid,
                    status : "Pending",
                    imgURL : 'http://vollrath.com/ClientCss/images/VollrathImages/No_Image_Available.jpg'
                })
                .then(res => {
                    if(image){
                        const id = res.path.pieces_[1];
                        let imgUpload = firebase.storage().ref(`crimeImages/${id}`).put(image);
                        
                        imgUpload.on('state_changed', 
                            (snapshot) => {
                            
                            },(err) => {
                                this.setState({loading : false, error : err});
                            },() => {
                                imgUpload.snapshot.ref.getDownloadURL()
                                    .then(downloadURL => {
                                        const updateObj = {};
                                        updateObj[`crimes/${id}/imgURL`] = downloadURL;
                                        firebase.database().ref().update(updateObj)                            
                                })
                               this.submitCompleted();
                            })
                    }
                    else{
                        this.submitCompleted();
                    }
                })
                .catch(err => {
                    this.setState({loading : false, error : err});
                })
            }
            else{
                alert("Invalid Time")
            }
        }
        else{
            alert("Only JPEG, JPG and PNG formats are allowed")
        }
    }

    submitCompleted = () => {
        this.date = new Date();
        this.setState({
            loading : false,
            error : null,
            city:  this.state.city,
            area : '',
            type : 'snatching',
            time : `${this.date.getFullYear()}-${this.date.getMonth() + 1}-${this.date.getDate()}T${this.date.getHours()}:${this.date.getMinutes()}`,
            description : '',
            image : null,
            isSubmitted : true,
        });
    }

    back = () => {
        this.props.history.push('/crimes');
    }

    more = () => {
        this.setState({isSubmitted : false});
    }

    render(){
        return(
     <div  className = "Main">
            <p className="h1 heading font-weight-bold">Report Crime</p>
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
                            validators={['required']}
                            errorMessages={['This field is required']}
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
                                <MenuItem value={"snatching"}>Snatching</MenuItem>
                                <MenuItem value={"cyber"}>Cyber Crime</MenuItem>
                                <MenuItem value={"extortion"}>Extortion</MenuItem>
                                <MenuItem value={"blackmail"}>Blackmail</MenuItem>
                                <MenuItem value={"fraud"}>Fraud</MenuItem>
                                <MenuItem value={"murder"}>Murder</MenuItem>
                                <MenuItem value={"other"}>Other</MenuItem>
                            </Select>
                        </FormControl><br/>

                        <TextField
                            id="datetime-local"
                            label="When it Happened"
                            name = "time"
                            onChange={this.handleChange}
                            type="datetime-local"
                            defaultValue={this.state.time}
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
                        <label>Picture (If any) <input type = "file" className = {this.props.classes.file} onChange = {this.fileChangedHandler}/></label><br/>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            className="button">Post</Button>
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

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(ReportCrime));