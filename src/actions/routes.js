import * as actionType from '../constants/redux'


export function add(routes){
    return {
        type: actionType.ROUTES_ADD,
        routes
    }
}