import { BaseState } from "../base/BaseState";
import { ManyToOneType } from "./actions";
import { LIST_ENTITIES, GET_UN_MAPPED_COLUMNS } from '../consts';
import { DataResponse } from "../base/DataResponse";
import { UnMappedColumnDTO } from "./types";

export interface ManyToOneReducerState extends BaseState {
    entityList?: Array<string>,
    unMappedColumns?: Array<UnMappedColumnDTO>
}

const defaultState: ManyToOneReducerState = {

}

function reducer(state: ManyToOneReducerState = defaultState, action: ManyToOneType) {
    switch (action.type) {
        case LIST_ENTITIES:
            if (action.isError) {
                const newState: ManyToOneReducerState = { ...state }
                newState.error = action.payload;
                return newState;
            } else {
                const newState: ManyToOneReducerState = { ...state }
                const resp = action.payload as DataResponse<Array<string>>
                newState.entityList = resp.data
                return newState
            }
        case GET_UN_MAPPED_COLUMNS:
            const newState: ManyToOneReducerState = { ...state }
            if (action.isError) {
                newState.error = action.payload
                return newState
            } else {
                const resp = action.payload as DataResponse<Array<UnMappedColumnDTO>>
                newState.unMappedColumns = resp.data
            }
            return newState
        default:
            return state
    }
}

export default reducer;