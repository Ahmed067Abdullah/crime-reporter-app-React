import React from 'react';

import Aux from '../../hoc/Auxiliary/Auxiliary';

// Material UI imports start
import { withStyles } from "@material-ui/core/styles";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
// Material UI imports end

const styles = theme => {
    return {
        formControl: {
            marginTop : "20px",
            marginBottom : "20px",
            width: "280px",
        }
    }
}
const reports = (props) => {
    console.log(props.status)
    
    return(
        <div>
        {props.showCities ? 
            <Aux>
                <FormControl className={props.classes.formControl}>
                    <InputLabel htmlFor="bg">City</InputLabel>
                    <Select
                        value={props.city}
                        onChange={(event) => props.handleChange(event,'city')}
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
            </Aux>
        : null}
        {props.showStatuses ? 
            <Aux>
                <FormControl className={props.classes.formControl}>
                    <InputLabel htmlFor="b">Status</InputLabel>
                    <Select
                        value={props.status}
                        onChange={(event) => props.handleChange(event,'status')}
                        inputProps={{
                            name: 'status',
                            id: 'b',
                        }}>
                        <MenuItem value={"Pending"}>Pending</MenuItem>
                        <MenuItem value={"Working"}>Working</MenuItem>
                        <MenuItem value={"Satisfied"}>Satisfied</MenuItem>
                        <MenuItem value={"Canceled"}>Canceled</MenuItem>
                    </Select>
                </FormControl><br/>
            </Aux>
        : null}
        <div>
            {props.reports}
        </div>
    </div>
    )
}

export default (withStyles(styles)(reports));