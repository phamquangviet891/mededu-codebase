import { configureStore, MiddlewareArray } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import rootReducer from './rootReducer';
export const store = configureStore({
    reducer: rootReducer,
    middleware: new MiddlewareArray().concat(logger)
});


export type AppDispatch = typeof store.dispatch
export default store;