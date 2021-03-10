import {createStore, combineReducers} from 'redux';
import authReducer from './reducers/auth';
import membersReducer from './reducers/member';

const rootReducer = combineReducers({
    auth: authReducer,
    members:membersReducer
});

const store = createStore(rootReducer);
export default store;