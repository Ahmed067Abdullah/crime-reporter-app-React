import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class MissingPersons extends Component{
    render(){
        return(
            <div>
            <p>Missing Persons</p>
            <Link to = "reportMissingPerson">New</Link>
            </div>
        )
    }
}

export default MissingPersons;