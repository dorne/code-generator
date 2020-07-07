import * as actionType from '../constants/redux'


export function add(breadcrumb){
    return {
        type: actionType.BREADCRUMB_ADD,
        breadcrumb
    }
}