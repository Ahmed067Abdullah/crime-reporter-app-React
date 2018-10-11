import * as actionTypes from './actionTypes';

export const setReports = (reports) => {
    return{
        type : actionTypes.SET_REPORTS,
        reports
    }
}