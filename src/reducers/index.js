import counter from './counter'
import match from './match'
import routes from './routes'
import { combineReducers } from 'redux'

const rootReducers = combineReducers({
    counter,
    match,
    routes
})

export default rootReducers