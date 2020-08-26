import { ListEntitiesAction } from "../manytoone/actions";
import { LIST_ENTITY_PROPERTIES, LIST_M2O_BASIC_PROPERTIES } from "../consts";
import { EntityBasicProp, EntityPropertiesResponse, EntityManyToOneProperty } from "./types";


export interface DtoGeneratorState {
    entityBasicProperties?: Array<EntityBasicProp>,
    m2oPropList?: Array<EntityManyToOneProperty>,
    basicPropsOfM2o?: Array<EntityAndBasicProperties>
}

export interface EntityAndBasicProperties {
    entityName: string,
    basicProperties?: Array<EntityBasicProp>
}

const initState: DtoGeneratorState = {
    basicPropsOfM2o: new Array<EntityAndBasicProperties>()
}

function reducer(state: DtoGeneratorState = initState, action: ListEntitiesAction) {
    const st: DtoGeneratorState = { ...state }
    switch (action.type) {
        case LIST_ENTITY_PROPERTIES:
            if (!action.isError) {
                st.entityBasicProperties = (action.payload as EntityPropertiesResponse).data?.basicPropsList;
                st.m2oPropList = (action.payload as EntityPropertiesResponse).data?.m2oPropsList;
            } 
            return st;
        case LIST_M2O_BASIC_PROPERTIES:
            // console.log("[LIST_M2O_BASIC_PROPERTIES]");
            if(!action.isError){
                const resp = (action.payload as EntityPropertiesResponse);
                const data = resp.data as EntityAndBasicProperties;
                // st.basicPropsOfM2o?.push(data);
                const a = new Array<EntityAndBasicProperties>();
                st.basicPropsOfM2o?.forEach(p => {
                    a.push(p)
                })
                a?.push(data);
                st.basicPropsOfM2o = a;
                return st;
            }
        default:
            return state;
    }
}

export default reducer;