import { AxiosPromise } from "axios";
import { DataResponse } from "../base/DataResponse";
import { LIST_ENTITY_PROPERTIES, LIST_M2O_BASIC_PROPERTIES } from '../consts'
import Agent from '../../agent/axios'

export interface ListEntityPropsAction {
    type: string,
    payload: AxiosPromise<any> | DataResponse<string>,
    isError?: boolean
}

export interface ListM2oBasicPropsAction {
    type: string,
    payload: AxiosPromise<any> | DataResponse<string>,
    isError?: boolean
}

export function listEntityProperties(entityName: string): ListEntityPropsAction{
    return {
        type: LIST_ENTITY_PROPERTIES,
        payload: Agent.listEntityFields(entityName)
    }
}

export function listM2oBasicProperties(entityName: string): ListM2oBasicPropsAction{
    return {
        type: LIST_M2O_BASIC_PROPERTIES,
        payload: Agent.listEntityBasicFields(entityName)
    }
}