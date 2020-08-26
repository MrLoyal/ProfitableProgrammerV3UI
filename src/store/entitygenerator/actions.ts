import { DB_TABLE_LIST, LIST_COLUMNS, CREATE_ENTITY } from '../consts';
import agent from '../../agent/axios';
import { DataResponse } from '../base/DataResponse';
import { AxiosResponse } from 'axios';
import { TableColumnDTO } from './types';

export interface DbTableListAction {
    type: string,
    payload: DataResponse<string> | Promise<AxiosResponse<any>>,
    isError?: boolean
}

export interface ListColumnsAction {
    type: string,
    payload: DataResponse<TableColumnDTO> | Promise<AxiosResponse<any>>,
    isError?: boolean
}

export interface CreateEntityAction {
    type: string,
    payload: Promise<AxiosResponse<any>> | null,
    isError?: boolean
}

export function listDbTables(): DbTableListAction {
    return {
        type: DB_TABLE_LIST,
        payload: agent.listTables()
    }
}

export function listColumns(tableName: string): ListColumnsAction {
    return {
        type: LIST_COLUMNS,
        payload: agent.listColumns(tableName)
    }
}

export function createEntity(createEntityRequest: any){
    const action: CreateEntityAction = {
        type: CREATE_ENTITY,
        payload: agent.createEntity(createEntityRequest)
    }
    return action;
}

export type EntityGeneratorAction = DbTableListAction | ListColumnsAction