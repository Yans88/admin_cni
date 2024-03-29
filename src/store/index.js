import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/auth';
import levelReducer from './reducers/levelReducer';
import newsReducer from './reducers/newsReducer';
import pricelistReducer from './reducers/pricelistReducer';
import settingReducer from './reducers/settingReducer';
import voucherReducer from './reducers/voucherReducer';
import blastReducer from './reducers/blastReducer';
import mitraReducer from './reducers/mitraReducer';
import reportReducer from './reducers/reportReducer';
import limitBeliReducer from './reducers/limitBeliReducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const enhancer = composeEnhancers(
    applyMiddleware(thunk)
    // other store enhancers if any
);

const rootReducer = combineReducers({
    auth: authReducer,
    pricelist: pricelistReducer,
    setting: settingReducer,
    news: newsReducer,
    level: levelReducer,
    voucher: voucherReducer,
    blast: blastReducer,
    mitra: mitraReducer,
    reports: reportReducer,
    limitBeli: limitBeliReducer
});

const store = createStore(rootReducer, enhancer);
export default store;