import axios from 'axios'

axios.defaults.baseURL='http://localhost:6788/api';

const Agent = {
    listTables: () => {
        return axios.get('/listTables');
    },
    listColumns: (tableName: string) => {
        return axios.get('/columns?table=' + tableName);
    },
    createEntity: (createEntityRequest: any) =>{
        return axios.post('/createEntity', createEntityRequest);
    },
    listEntities: () => {
        return axios.get('/listEntities')
    },
    getUnMappedColumns: (entityName: string) =>{
        return axios.get('/getUnMappedColumns?entityName=' + entityName)
    },
    addManyToOne: (data: any) => {
        return axios.put('/addManyToOne', data);
    },
    listEntityFields: (entityName: string) => {
        return axios.get('/prepareEntityForDTO?entityName=' + entityName);
    },
    listEntityBasicFields: (entityName: string) => {
        return axios.get('/listEntityBasicFields?entityName=' + entityName);
    },

    createDTO: (data: any) => {
        return axios.post('/createDTO', data);
    },

    listDTOs: () => {
        return axios.get('/listDTOs');
    },
    createService: (data: any) => {
        return axios.post('/createService', data);
    }
    
}

export default Agent
