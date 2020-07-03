import * as actionType from '../constants/redux'


export function increment(num){
    return {
        type: actionType.INCREMENT,
        num
    }
}

export function decrement(num){
    return {
        type: actionType.DECREMENT,
        num
    }
}