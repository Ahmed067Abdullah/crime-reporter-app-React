import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Complaints extends Component{
    render(){
        return(
            <div>
            <p>Complaints</p>
            <Link to = "reportComplaint">New</Link>
            </div>
        )
    }
}

export default Complaints;