import * as actionType from '../constants/redux'


export function add(match){
    return {
        type: actionType.MATCH_ADD,
        match
    }
}