import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Crimes extends Component{
    render(){
        return(
            <div>
            <p>Crimes</p>
            <Link to = "/reportCrime">New</Link>
            </div>
        )
    }
}

export default Crimes;