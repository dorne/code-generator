import counter from './counter'
import location from './location'
import { combineReducers } from 'redux'

const rootReducers = combineReducers({
    counter,
    location
})

export default rootReducers