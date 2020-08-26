import { EntityGeneratorAction } from "./actions"
import { DB_TABLE_LIST, LIST_COLUMNS } from "../consts"
import { BaseState } from "../base/BaseState"
import { DataResponse } from "../base/DataResponse"
import { TableColumnDTO } from "./types"

export interface EntityGeneratorState extends BaseState {
    tableList?: Array<string>,
    columns?: Array<TableColumnDTO>
}

const initState: EntityGeneratorState = {

}

const reducer = (state: EntityGeneratorState = initState, action: EntityGeneratorAction) => {
    switch (action.type) {
        case DB_TABLE_LIST:
            if (action.isError) {
                return { ...state, error: true }
            } else {
                const response = (action.payload as DataResponse<string>)
                return { ...state, tableList: response.data }
            }
        case LIST_COLUMNS:
            if (action.isError) {
                return { ...state, error: action.payload }
            } else {
                const resp = action.payload as DataResponse<TableColumnDTO>
                return {...state, columns: resp.data}
            }
        default:
            return state;
    }
}

export default reducer;