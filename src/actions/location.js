import * as actionType from '../constants/redux'


export function add(math){
    return {
        type: actionType.ADD,
        math
    }
}