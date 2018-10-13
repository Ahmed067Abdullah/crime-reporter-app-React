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
// MUI imports start

const styles = theme => {
    return {
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

    clickedHandler = () => {
        const status = {}
        status[`missingPersons/${this.state.id}/status`] = this.state.updatedStatus;
        firebase.database().ref().update(status);
    }

    render(){
        let reportedAt = new Date(this.state.reportedAt).toString();
        reportedAt = reportedAt.slice(0,reportedAt.length - 34);     
        return(
            <div className = {this.props.classes.Main}>
                {this.state.city ?  
                <div className = "singles-card">
                    <Card>
                        <img src = {this.state.imgURL} className = "card-image" alt = "img"/>
                        <div className = "card-text">
                            <strong>Reported By</strong> : {this.state.reportedBy}<br/>
                            <strong>Reported At</strong> : {reportedAt}<br/>
                            <strong>Age</strong> : {this.state.age}<br/>
                            <strong>Appearance</strong> : {this.state.appearance}<br/>
                            <strong>Mental Condition</strong> : {this.state.condition}<br/>
                            <strong>Last Known Location</strong> : {this.state.location}<br/>
                            <strong>When</strong> : {this.state.time}<br/>
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
                    <Button 
                        type="submit" 
                        variant="contained" 
                        className={this.props.classes.button} 
                        onClick = {this.clickedHandler}>Save</Button>
                </div>
                : null
            } 
            </div>
        )
    }
}

export default withStyles(styles)(SingleMissingPerson);