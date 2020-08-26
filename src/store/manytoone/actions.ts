import { AxiosPromise } from "axios";
import { DataResponse } from "../base/DataResponse";
import {LIST_ENTITIES, GET_UN_MAPPED_COLUMNS, ADD_MANY_TO_ONE} from '../consts';
import agent from '../../agent/axios';
import { UnMappedColumnDTO } from "./types";

export interface ListEntitiesAction{
    type: string,
    payload: AxiosPromise<any> | DataResponse<string>,
    isError?: boolean
}


export interface GetUnMappedColumnsAction{
    type: string,
    payload: AxiosPromise<any> | DataResponse<Array<UnMappedColumnDTO>>,
    isError?: boolean
}

export interface AddManyToOneAction{
    type: string,
    payload: AxiosPromise<any> | void,
    isError?: boolean
}

export function listEntities(): ListEntitiesAction{
    let action: ListEntitiesAction = {
        type: LIST_ENTITIES,
        payload: agent.listEntities()
    }

    return action;
}

export function getUnMappedColumns(entityName: string): GetUnMappedColumnsAction{
    let action: GetUnMappedColumnsAction = {
        type: GET_UN_MAPPED_COLUMNS,
        payload: agent.getUnMappedColumns(entityName)
    }
    return action;
}

export function addManyToOne(data: any): AddManyToOneAction{
    return {
        type: ADD_MANY_TO_ONE,
        payload: agent.addManyToOne(data)
    }
}

export type ManyToOneType = ListEntitiesAction | GetUnMappedColumnsAction