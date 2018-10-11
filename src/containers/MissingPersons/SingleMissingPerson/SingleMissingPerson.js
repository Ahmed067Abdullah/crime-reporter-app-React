import React, {Component} from 'react';
import * as firebase from 'firebase';
import Card from '../../../hoc/Card/Card';
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = theme => {
    return {
        button: {
            backgroundColor : "#374F6B",
            color : "white",
            margin : "0px auto",
            marginLeft : "41%"
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
        id : ''
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
                updatedStatus : snapshot.val().status,
                id : this.props.match.params.id
            })
        })
    }
    
    handleChange = (event) => {
        this.setState({ [event.target.name] : event.target.value });
    }

    clickedHandler = () => {
        console.log(this.state.updatedStatus);
        firebase.database().ref(`missingPersons/${this.state.id}`).set({
            age : this.state.age,
            city: this.state.city,
            appearance : this.state.appearance,
            condition : this.state.condition,
            location : this.state.location,
            name : this.state.name,
            time : this.state.time,
            reportedBy : this.state.reportedBy,
            reportedAt : this.state.reportedAt,
            reporterId : this.state.reporterId,
            status : this.state.updatedStatus,
        })
    }

    render(){
        return(
            <div className = {this.props.classes.Main}>
                {this.state.city ? 
                <div className = "singles-card">
                    <Card>
                        <strong>Reported By</strong> : {this.state.reportedBy}<br/>
                        <strong>Reported At</strong> : {this.state.reportedAt}<br/>
                        <strong>Age</strong> : {this.state.against}<br/>
                        <strong>Appearance</strong> : {this.state.appearance}<br/>
                        <strong>Mental Condition</strong> : {this.state.condition}<br/>
                        <strong>Last Known Location</strong> : {this.state.location}<br/>
                        <strong>When</strong> : {this.state.time}<br/>
                        <strong>City</strong> : {this.state.city}<br/>
                        <strong>Status</strong> : {this.state.status}<br/>
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
                    <Button type="submit" variant="contained" className={this.props.classes.button} onClick = {this.clickedHandler}>Save</Button>
                </div>
                 : null
            } 
            </div>
        )
    }
}

export default withStyles(styles)(SingleMissingPerson);