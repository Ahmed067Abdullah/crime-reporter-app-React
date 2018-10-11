import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import * as firebase from 'firebase'

import Card from '../../hoc/Card/Card';
import Spinner from '../../components/UI/Spinner/Spinner';
import './Auth.css';

const styles = theme => {
    return {
        TextFields : {
            marginBottom : "20px",
            width : "95%"
        },
        button: {
            margin: theme.spacing.unit,
            marginBottom : "15px",
            backgroundColor : "#374F6B",
            color : "white"
          }
    }
}

class Auth extends Component{
    state = {
        email: '',
        pass : '',
        error : '',
        loading : false
    }

    componentDidMount() {
        ValidatorForm.addValidationRule('isLongEnough', (value) => {
            if (value.trim().length < 6) {
                return false;
            }
            return true;
        });
    }
 
    handleChange = (event) => {
        this.setState({ [event.target.name] : event.target.value });
    }
 
    handleSubmit = () => {
        this.setState({loading : true});
        if(this.props.isSignup){
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.pass)
            .then(res => {
                const uid = res.user.uid;
                this.setState({loading : false});
                this.props.onLogin(uid);
                this.props.history.replace("/crimes");
            })
            .catch(error => {
                this.setState({loading : false});
                let errorMessage = '';
                if(error.code === 'auth/email-already-in-use')
                    errorMessage = "Account For This Email is Already Registered"
                else if(error.code === 'auth/invalid-email')
                    errorMessage = "Invalid Email"
                else     
                    errorMessage = error.message;
                this.setState({error : errorMessage})
            });
        }
        else{
            firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.pass)
            .then(res =>{
                // const uid = res.user.uid;
                this.props.history.replace("/crimes");
            })    
            .catch(error =>{
                this.setState({loading : false});
                let errorMessage = ''
                if(error.code === 'auth/wrong-password')
                    errorMessage = "Wrong Password";
                else if(error.code === 'auth/user-not-found')  
                    errorMessage = "User Doesn't Exist";  
                else     
                    errorMessage = error.message;                    
                this.setState({error : errorMessage})
              });
        }
    }

    switchAuthState = () => {
        if(this.props.isSignup){
            this.props.onSignin()
        }
        else{
            this.props.onSignup()
        }
    }
    render(){
        let authMessage = "Already Have an Account? ";
        let authLink = "Sign in";
        if(!this.props.isSignup){
            authMessage = "Dont Have an Account? ";
            authLink = "Sign up";
        }
        return(
            <div  className = "Main">
            <p className="h1 heading font-weight-bold text-uppercase">Crime Reporter</p>
            {!this.state.loading ?
                <Card>
                    <p className = "Error">{this.state.error ? this.state.error  : null}</p>
                    <ValidatorForm
                        ref="form"
                        onSubmit={this.handleSubmit}
                        onError={errors => console.log(errors)}
                    >
                        <TextValidator
                            className = {this.props.classes.TextFields}
                            label="Email"
                            onChange={this.handleChange}
                            name="email"
                            value={this.state.email}
                            validators={['required', 'isEmail']}
                            errorMessages={['This field is required', 'Invalid Email']}
                        /><br/>
                        <TextValidator
                            className = {this.props.classes.TextFields}
                            label="Password"
                            type="password"
                            onChange={this.handleChange}
                            name="pass"
                            value={this.state.pass}
                            validators={['required', 'isLongEnough']}
                            errorMessages={['This field is required', 'Password must be longer than 6 characters']}
                        /><br/>
                        <Button type="submit" variant="contained"  className={this.props.classes.button}>
                            Submit
                        </Button>
                    </ValidatorForm>
                    <p>{authMessage}<strong style = {{ textDecoration : 'underline', cursor : 'pointer'}} onClick = {this.switchAuthState}>{authLink}</strong></p>
                </Card> : <div  className = "auth-spinner"><Spinner/></div>}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return{
        isAuth : state.auth.isAuth,
        isSignup : state.auth.isSignup
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onLogin : (uid) => dispatch(actions.login(uid)),
        onLogout : () => dispatch(actions.logout()),
        onSignin : () => dispatch(actions.setSignin()),
        onSignup : () => dispatch(actions.setSignup())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Auth));