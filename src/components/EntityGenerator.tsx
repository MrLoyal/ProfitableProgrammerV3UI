import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listDbTables, listColumns, createEntity } from '../store/entitygenerator/actions';
import { Select, Form, Table, Checkbox, Input, Button } from 'antd';
import { RootState } from '../store';
import { EntityGeneratorState } from '../store/entitygenerator/entityGeneratorReducer';
import { TableColumnDTO } from '../store/entitygenerator/types';
import { snakeToCammelVar, dbTypeToJavaType, snakeToCammelClass } from '../utils';

const { Option } = Select;

const layout1: any = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 }
}

const layout: any = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
}

function EntityGenerator(props: any) {
    const dispatch = useDispatch();
    const listDbTablesFunc = useCallback(listDbTables, []);
    const [selectedRowKeys, setSelectedRowKeys] = useState(new Array<string>())
    const [tableName, setTableName] = useState('');
    const [form] = Form.useForm();

    const tables: Array<string> | undefined = useSelector((state: RootState) => {
        const a: EntityGeneratorState = state.entityGenerator;
        return a.tableList;
    })
    const columns: Array<TableColumnDTO> | undefined = useSelector((state: RootState) => {
        const a: EntityGeneratorState = state.entityGenerator;
        return a.columns;
    })

    useEffect(() => {
        dispatch(listDbTablesFunc());
    }, [dispatch, listDbTablesFunc])

    useEffect(() => {
        const mSelectedRowKeys = new Array<string>();
        columns?.forEach(dto => {
            if (!dto.foreignKey) {
                mSelectedRowKeys.push(dto.columnName);
            }
        })
        console.log("mSelectedRowKeys: ", mSelectedRowKeys)
        setSelectedRowKeys(mSelectedRowKeys);
    }, [columns])

    function getTableSelectItems() {
        if (!tables || tables.length === 0) {
            return null;
        }

        const items = tables.map(t => (
            <Option key={t} value={t}>{t}</Option>
        ));
        return items;
    }

    function filterOption(inputValue: string, option: any) {
        return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
    }

    function onTableSelectChanged(value: string) {
        setTableName(value);
        dispatch(listColumns(value));
    }


    const tableColumns: Array<any> = [
        {
            title: 'No.',
            render: (t: string, r: TableColumnDTO, i: number) => i + 1,
            width: 20
        },
        {
            title: 'Column',
            render: (t: string, r: TableColumnDTO, i: number) => r.columnName
        },
        {
            title: 'Type',
            render: (t: string, r: TableColumnDTO, i: number) => r.columnType
        },
        {
            title: 'Nullable',
            render: (t: string, r: TableColumnDTO, i: number) => {
                return (
                    <Checkbox checked={r.nullable} disabled />
                )
            }
        },
        {
            title: 'Java name',
            render: (t: string, r: TableColumnDTO, i: number) => {
                return (
                    <Form.Item name={'javaName_' + r.columnName}>
                        <Input />
                    </Form.Item>
                )
            }
        },
        {
            title: 'Java type',
            render: (t: string, r: TableColumnDTO, i: number) => {
                return (
                    <Form.Item name={'javaType_' + r.columnName}>
                        <Input />
                    </Form.Item>
                )
            }
        },
    ]

    const rowSelection = {
        selectedRowKeys: selectedRowKeys,
        onChange: (v: any) => {
            setSelectedRowKeys(v);
        }
    }

    function getColumnType(key: string){
        if(columns && columns.length > 0){
            for(let i = 0; i < columns.length; i++){
                const dto: TableColumnDTO = columns[i];
                if(dto.columnName === key){
                    return dto.columnType
                }
            }
        }

        return '';
    }

    function getNullable(key: string): boolean{
        if(columns && columns.length > 0){
            for(let i = 0; i < columns.length; i++){
                const dto: TableColumnDTO = columns[i];
                if(dto.columnName === key){
                    return dto.nullable
                }
            }
        }
        return false;
    }

    function getCharacterMaxLength(key: string): number{
        if(columns && columns.length > 0){
            for(let i = 0; i < columns.length; i++){
                const dto: TableColumnDTO = columns[i];
                if(dto.columnName === key){
                    return dto.characterMaxLength;
                }
            }
        }
        return 0;
    }

    function onFormFinish(values: any) {
        // console.log("Selected rows: ", selectedRowKeys)

        const data: any = {
            tableName: tableName,
            idColumnName: values.idColumnName,
            strategy: values.strategy,
            entityName: values.entityName
        }

        const basicProperties = new Array<any>();

        selectedRowKeys.forEach(k => {
            const bp = {
                columnName: k,
                columnType: getColumnType(k),
                javaName: values['javaName_' + k],
                javaType: values['javaType_' + k],
                nullable: getNullable(k),
                characterMaxLength: getCharacterMaxLength(k)
            }
            basicProperties.push(bp);
        })

        data['basicProperties'] = basicProperties;

        console.log("Data: ", data);
        dispatch(createEntity(data));
    }

    function prepareFormInitValues(): any {

        const values: any = {
            idColumnName: 'id',
            strategy: 'IDENTITY',
            entityName: snakeToCammelClass(tableName)
        }

        if (columns && columns.length > 0) {
            // dto is the TableColumnDTO
            columns.forEach(dto => {
                values['javaName_' + dto.columnName] = snakeToCammelVar(dto.columnName);
                values['javaType_' + dto.columnName] = dbTypeToJavaType(dto.dataType, dto.nullable)
            })
        }

        // console.log("prepareFormInitValues... ", values)
        return values;
    }

    const formInitValues: any = prepareFormInitValues();

    function getIdColumnOptions(): any {
        if(columns && columns.length > 0){
            return columns.map(dto => (
                <Option key={dto.columnName} value={dto.columnName}>
                    {dto.columnName}
                </Option>
            ))
        }

        return null;
    }

    function getForm() {
        if (columns && columns.length > 0) {
            return (
                <Form {...layout} form={form} onFinish={onFormFinish} initialValues={formInitValues}>
                    <Form.Item 
                        {...layout1}
                        name='entityName' label="Entity name">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        {...layout1}
                        name='idColumnName' label="ID colum" help='We only support single column ID'>
                        <Select>
                            {getIdColumnOptions()}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        {...layout1}
                        name='strategy' label="Strategy">
                        <Select>
                            <Option value='IDENTITY'>IDENTITY</Option>
                        </Select>
                    </Form.Item>

                    <Table
                        rowKey={row => row.columnName}
                        rowSelection={rowSelection}
                        size='small'
                        pagination={false}
                        columns={tableColumns}
                        dataSource={columns} />
                    <Form.Item style={{ marginTop: '16px' }}>
                        <Button type='primary' htmlType='submit'>Submit</Button>
                    </Form.Item>
                </Form>
            )
        } else {
            return null;
        }

    }

    return (
        <React.Fragment>
            <Form.Item
                {...layout1}
                name='tableName'
                label='Select a Table' >
                <Select showSearch
                    value={tableName}
                    onChange={onTableSelectChanged}
                    optionFilterProp="children"
                    filterOption={filterOption}>
                    {getTableSelectItems()}
                </Select>
            </Form.Item>

            {getForm()}

        </React.Fragment>
    );
}

export default EntityGenerator;