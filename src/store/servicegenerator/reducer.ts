import { LIST_M2O_BASIC_PROPERTIES, LIST_DTO } from "../consts";
import { EntityBasicProp, EntityPropertiesResponse, EntityManyToOneProperty } from "./types";
import { ListDTOsAction } from "./actions";
import { DataResponse } from '../base/DataResponse'

export interface DtoGeneratorState {
    dtoList?: Array<string>
}

const initState: DtoGeneratorState = {
    dtoList: new Array<string>()
}

function reducer(state: DtoGeneratorState = initState, action: ListDTOsAction) {
    const st: DtoGeneratorState = { ...state }
    switch (action.type) {
        case LIST_DTO:
            if (!action.isError) {
                st.dtoList = ((action.payload as DataResponse<Array<string>>)).data
            }
            return st;

        default:
            return state;
    }
}

export default reducer;