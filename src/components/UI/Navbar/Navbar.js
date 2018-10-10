import React from "react";
import {withRouter, NavLink} from 'react-router-dom';
import {connect} from 'react-redux';

class Navbar extends React.Component {
  state = {
    value: 0
  };

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light text-left">
        <NavLink className="navbar-brand" to="#">Crime Reporter</NavLink>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <NavLink className="nav-link" to="/auth">Authenticate</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/crimes">Crimes</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/missingPersons">Missing Persons</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link"to="/complaints">Complaints</NavLink>
            </li>
          </ul>
          <span class="navbar-text">
            <NavLink className="nav-link"to="/logout">Logout</NavLink>
          </span>
        </div>
      </nav>
    //   <nav class="navbar navbar-expand-lg navbar-light bg-light">
    //   <a class="navbar-brand" href="#">Navbar</a>
    //   <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
    //     <span class="navbar-toggler-icon"></span>
    //   </button>
    //   <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
    //     <div class="navbar-nav">
    //       <a class="nav-item nav-link active" href="#">Home <span class="sr-only">(current)</span></a>
    //       <a class="nav-item nav-link" href="#">Features</a>
    //       <a class="nav-item nav-link" href="#">Pricing</a>
    //       <a class="nav-item nav-link disabled" href="#">Disabled</a>
    //     </div>
    //   </div>
    // </nav>
    )
  }

}
export default Navbar;
