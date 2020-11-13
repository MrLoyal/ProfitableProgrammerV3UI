import {createStore, combineReducers, compose, applyMiddleware } from 'redux';
import promiseMiddleware from './middlewares/promiseMiddleware';
import entityGeneratorReducer from './entitygenerator/entityGeneratorReducer';
import m2oReducer from './manytoone/reducer';
import dtoGeneratorReducer from './dtogenerator/reducer';
import serviceGeneratorReducer from './servicegenerator/reducer'

const rootReducer = combineReducers({
    entityGenerator: entityGeneratorReducer,
    manyToOne: m2oReducer,
    dtoGenerator: dtoGeneratorReducer,
    servicegenerator: serviceGeneratorReducer
});

export type RootState = ReturnType<typeof rootReducer>

let composeEnhancers;
if (process.env.NODE_ENV === 'production') {
    composeEnhancers = compose;
} else {
    composeEnhancers = (window as any)['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] as typeof compose || compose;
}

const store =
    createStore(
        rootReducer,
        composeEnhancers(
            applyMiddleware(
                promiseMiddleware
            )
        )
    );

export default store;