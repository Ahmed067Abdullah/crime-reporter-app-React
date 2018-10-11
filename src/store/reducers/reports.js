import * as actionTypes from '../actions/actionTypes';

const initialState = {
    reports : []
}

const reducer = (state =initialState, action) => {
    switch(action.type){
        case actionTypes.SET_REPORTS:
            return{
                ...state,
                reports : action.reports
            }
        default:
            return state;    
    }
}

export default reducer;