import * as actionTypes from '../actions/actionTypes';

const initialState = {
    isAuth : false,
    isSignup : true,
    isRegistered : false,
    uid : '',
    uname : '',
    isAdmin : false
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.SET_SIGNIN : 
            return{
                ...state,
                isSignup : false
            }
        case actionTypes.SET_SIGNUP:
            return{
                ...state,
                isSignup : true
            }
        case actionTypes.LOGIN : 
            return{
                ...state,
                isAuth : true,
                uid : action.uid
            }
        case actionTypes.LOGOUT:
            return{
                ...state,
                isAuth : false,
                isSignup : true,
                isRegistered : false,
                isAdmin : false,
                uid : '',
                uname : ''
            }
        case actionTypes.REGISTERED_REPORTER:
            return{
                ...state,
                isRegistered : true,
                uname : action.uname
            }
        case actionTypes.SET_ADMIN:
            return{
                ...state,
                isAdmin : true
            }        
        default:
            return state;     
    }
}

export default reducer;