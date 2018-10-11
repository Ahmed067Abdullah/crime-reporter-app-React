import React, {Component} from 'react';
import * as firebase from 'firebase';
import Card from '../../../hoc/Card/Card';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
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
        id : ''
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
        firebase.database().ref(`crimes/${this.state.id}`).set({
            city: this.state.city,
            area : this.state.area,
            type : this.state.type,
            time : this.state.time,
            description : this.state.description,
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
                        <strong>Type</strong> : {this.state.type}<br/>
                        <strong>Description</strong> : {this.state.description}<br/>
                        <strong>When</strong> : {this.state.time}<br/>
                        <strong>Area</strong> : {this.state.area}<br/>  
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

export default withStyles(styles)(SingleCrime);