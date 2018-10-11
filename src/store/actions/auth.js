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

export const registeredReporter = () => {
    return {
        type : actionTypes.REGISTERED_REPORTER
    }
}
