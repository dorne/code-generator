import counter from './counter'
import match from './match'
import { combineReducers } from 'redux'

const rootReducers = combineReducers({
    counter,
    match
})

export default rootReducers