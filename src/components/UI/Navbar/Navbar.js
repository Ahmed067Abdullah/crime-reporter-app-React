import React from "react";
import {withRouter, NavLink, Link} from 'react-router-dom';
import './Navbar.css';
import {connect} from 'react-redux';


class Navbar extends React.Component {
  state = {
    value: 0
  };

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light text-left Nav">
        <Link className="navbar-brand" to="#"><h3 className = "display-5 nav-text">Crime Reporter</h3></Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav mr-auto">
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle nav-text" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Profile</a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <Link className="dropdown-item" to="/about">About</Link>
              <Link className="dropdown-item" to="/complaints">My Reported Complaints</Link>
              <Link className="dropdown-item" to="/crimes">My Reported Crimes</Link>
              <Link className="dropdown-item" to="missingPersons">My Reported Missing Persons</Link>
              <div className="dropdown-divider"></div>
              <Link className="dropdown-item" to="/logout">Logout</Link>
            </div>
            </li>
            <li className="nav-item active">
              <NavLink className="nav-link nav-text" to="/auth">Authenticate</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-text" to="/crimes">Crimes</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-text" to="/missingPersons">Missing Persons</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-text"to="/complaints">Complaints</NavLink>
            </li>
          </ul>
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
