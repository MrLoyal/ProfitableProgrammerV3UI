import axios from 'axios'

axios.defaults.baseURL='http://localhost:8080/api';

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
    
}

export default Agent