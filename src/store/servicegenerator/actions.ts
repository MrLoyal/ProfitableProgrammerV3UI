import { AxiosPromise } from "axios";
import { DataResponse } from "../base/DataResponse";
import { LIST_DTO } from '../consts'
import Agent from '../../agent/axios'

export interface ListDTOsAction {
    type: string,
    payload: AxiosPromise<any> | DataResponse<Array<string>>,
    isError?: boolean
}


export function listDTOs(): ListDTOsAction{
    return {
        type: LIST_DTO,
        payload: Agent.listDTOs()
    }
}
