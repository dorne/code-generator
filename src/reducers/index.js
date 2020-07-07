import counter from './counter'
import match from './match'
import routes from './routes'
import breadcrumb from './breadcrumb'
import { combineReducers } from 'redux'

const rootReducers = combineReducers({
    counter,
    match,
    routes,
    breadcrumb
})

export default rootReducers