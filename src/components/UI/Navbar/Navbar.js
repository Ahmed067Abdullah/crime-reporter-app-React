import React from "react";
import {withRouter, NavLink, Link} from 'react-router-dom';
import './Navbar.css';
import {connect} from 'react-redux';
import Aux from '../../../hoc/Auxiliary/Auxiliary';

class Navbar extends React.Component {
  state = {
    value: 0
  };

  render() {
    let navConflict = (
      <li className="nav-item">
        <NavLink className="nav-link nav-text" activeClassName = "active" activeStyle = {{fontWeight : "bold"}} to="/auth">Authenticate</NavLink>
      </li>)

    if(this.props.isAdmin){
      navConflict = (
        <Aux>
          <li className="nav-item active">
            <NavLink className="nav-link nav-text" activeClassName = "active" to="/logout">Logout</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link nav-text" activeClassName = "active" to="/complaints">Complaints</NavLink>
           </li>
        </Aux>)
    }
    
    else if(this.props.isAuth){
      navConflict = (
        <Aux>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle nav-text" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Profile</a>
          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <Link className="dropdown-item" to="/register">{this.props.isRegistered ? "Update Profile" : "Register"}</Link>
            <Link className="dropdown-item" to="/myComplaints">My Reported Complaints</Link>
            <Link className="dropdown-item" to="/myCrimes">My Reported Crimes</Link>
            <Link className="dropdown-item" to="myMissingPersons">My Reported Missing Persons</Link>
            <div className="dropdown-divider"></div>
            <Link className="dropdown-item" to="/logout">Logout</Link>
          </div>
        </li>
        <li className="nav-item">
            <NavLink className="nav-link nav-text" activeClassName = "active" to="/complaints">Complaints</NavLink>
        </li>
        </Aux>
      )
    }
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light text-left Nav">
        <Link className="navbar-brand" to="#"><h3 className = "display-5 nav-text">Crime Reporter</h3></Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav mr-auto">
            {navConflict}
            <li className="nav-item">
              <NavLink className="nav-link nav-text" activeClassName = "active" to="/crimes">Crimes</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-text" activeClassName = "active" to="/missingPersons">Missing Persons</NavLink>
            </li>
          </ul>
        </div>
      </nav>
    )
  }

}

const mapStateToProps = state => {
  return{
    isAuth : state.auth.isAuth,
    isRegistered : state.auth.isRegistered,
    isAdmin : state.auth.isAdmin
  }
}
export default connect(mapStateToProps)(Navbar);
