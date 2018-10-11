import * as actionTypes from './actionTypes';

export const setSignin = () => {
    return{
        type : actionTypes.SET_SIGNIN
    }
}

export const setSignup = () => {
    return{
        type : actionTypes.SET_SIGNUP
    }
}

export const login = (uid) => {
    return{
        type : actionTypes.LOGIN,
        uid
    }
}

export const logout = () => {
    return{
        type : actionTypes.LOGOUT
    }
}

export const registeredReporter = (uname) => {
    return {
        type : actionTypes.REGISTERED_REPORTER,
        uname
    }
}

export const setAdmin = () => {
    return {
        type : actionTypes.SET_ADMIN
    }
}
