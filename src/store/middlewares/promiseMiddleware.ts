function isPromise(v: any){
    return v && typeof v.then === 'function';
}

function promiseMiddleware(store: any){
    return function(next: any){
        return function(action: any){
            if(isPromise(action.payload)){
                action.payload
                .then((resp: any) => {
                    store.dispatch({
                        type: action.type,
                        payload: resp,
                        isError: false
                    })
                })
                .catch((error: any) => {
                    store.dispatch({
                        type: action.type,
                        payload: error,
                        isError: true
                    })
                })
            } else {
                next(action);
            }
        }
    }
}

export default promiseMiddleware