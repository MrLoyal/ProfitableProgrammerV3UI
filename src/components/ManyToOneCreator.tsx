import React, { useEffect, useState } from 'react'
import { ManyToOneCreatorProps, UnMappedColumnDTO } from '../store/manytoone/types';
import { Row, Col, Select, Form, Table, Input, Checkbox, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { listEntities, getUnMappedColumns, addManyToOne } from '../store/manytoone/actions'
import { RootState } from '../store';
import { dbColumnNameToVarName, pluralize, classNameToVarName } from '../utils';

const { Option } = Select;

function ManyToOneCreator(props: ManyToOneCreatorProps) {

    const dispatch = useDispatch();
    const [entityName, setEntityName] = useState('');
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [form] = Form.useForm();
    const entities = useSelector((state: RootState) => state.manyToOne.entityList);
    const unMappedColumns = useSelector((state: RootState) => state.manyToOne.unMappedColumns);

    useEffect(() => {
        dispatch(listEntities())
    }, [dispatch])

    // useEffect(() => {
    //     setFormValues();
    // }, [unMappedColumns])

    const tbCols = [
        {
            title: 'Column',
            render: (t: string, r: UnMappedColumnDTO, i: number) => r.columnName
        },
        {
            title: 'Type',
            render: (t: string, r: UnMappedColumnDTO, i: number) => r.columnType
        },
        {
            title: 'Refer to',
            render: (t: string, r: UnMappedColumnDTO, i: number) => {
                if (r.referencedTable) {
                    return r.referencedTable + '(' + r.referencedColumn + ')'
                } else {
                    return '-'
                }
            }
        },
        {
            title: 'Map as',
            width: 200,
            render: (t: string, r: UnMappedColumnDTO, i: number) => {
                return (
                    <Form.Item name={'mapAs_' + r.columnName}>
                        <Input />
                    </Form.Item>
                )
            }
        },
        {
            title: 'Parent side',
            render: (t: string, r: UnMappedColumnDTO, i: number) => {
                return (
                    <Form.Item name={'parentSide_' + r.columnName}>
                        <Select>
                            {getEntitySelectOptionsForColumn(r.columnName)}
                        </Select>
                    </Form.Item>
                )
            }
        },
        {
            title: 'Bidirectional',
            render: (t: string, r: UnMappedColumnDTO, i: number) => {
                return (
                    <Form.Item name={'bidirectional_' + r.columnName} valuePropName='checked'>
                        <Checkbox />
                    </Form.Item>
                )
            }
        },
        {
            title: 'Gen add util',
            render: (t: string, r: UnMappedColumnDTO, i: number) => {
                return (
                    <Form.Item name={'genAddUtil_' + r.columnName} valuePropName='checked'>
                        <Checkbox />
                    </Form.Item>
                )
            }
        },
        {
            title: 'Children name',
            render: (t: string, r: UnMappedColumnDTO, i: number) => {
                return (
                    <Form.Item name={'childrenName_' + r.columnName}>
                        <Input />
                    </Form.Item>
                )
            }
        }
    ]


    // function setFormValues(): void {
    //     if (unMappedColumns && unMappedColumns.length > 0) {
    //         if (form) {
    //             console.log("Now set form values with hardcoded data");
    //             // form.setFieldsValue([{
    //             //     name: 'parentSide_created_by',
    //             //     value: 'User'
    //             // }])
    //             form.setFieldsValue({ parentSide_created_by: 'User' })
    //         } else {
    //             console.log("NOT form");
    //         }
    //     } else {
    //         console.log("Nothing unmapped");
    //     }
    // }

    function onChildEntitySelectChanged(value: string) {
        setEntityName(value)
        dispatch(getUnMappedColumns(value))
    }

    function getEntitySelectOptions() {
        if (entities) {
            return entities.map((entity: string) => {
                return (
                    <Option key={entity} value={entity}>
                        {entity}
                    </Option>
                )
            })
        }
        return null;
    }

    function getEntitySelectOptionsForColumn(columnName: string) {
        if (entities) {
            return entities.map((entity: string) => {
                return (
                    <Option key={entity + "_" + columnName} value={entity}>
                        {entity}
                    </Option>
                )
            })
        }
        return null;
    }

    const rowSelection = {
        selectedRowKeys: selectedRowKeys,
        onChange: (keys: any) => { setSelectedRowKeys(keys) }
    }

    function getFormInitValues(): any {
        if (unMappedColumns) {
            const vals: any = {}
            for (let i = 0; i < unMappedColumns.length; i++) {
                const column = unMappedColumns[i];
                vals['parentSide_' + column.columnName] = column.suggestedOtherSide
                vals['mapAs_' + column.columnName] = dbColumnNameToVarName(column.columnName)
                vals['childrenName_' + column.columnName] = classNameToVarName(pluralize(entityName));
            }
            console.log("Form init values: ", vals);
            return vals;
        }
    }

    function onFormFinish(formValues: any) {
        const data: any = {
            entityName: entityName
        }
        const manyToOneProperties = new Array<any>();
        if (selectedRowKeys && selectedRowKeys.length > 0) {
            for (let i = 0; i < selectedRowKeys.length; i++) {
                const columnName = selectedRowKeys[i];
                const o2M: any = {
                    joinColumnName: columnName,
                    mapAs: formValues['mapAs_' + columnName],
                    parentSideEntityName: formValues['parentSide_' + columnName],
                    bidirectional: formValues['bidirectional_' + columnName],
                    genAddUtil: formValues['genAddUtil_' + columnName],
                    childrenName: formValues['childrenName_' + columnName]
                }
                manyToOneProperties.push(o2M);
            }
        }
        data['manyToOneProperties'] = manyToOneProperties;

        console.log("Add manyToOne request data: ", data);

        dispatch(addManyToOne(data));
    }

    function getForm() {
        if (unMappedColumns) {
            return (
                <Form
                    onFinish={onFormFinish}
                    form={form}
                    initialValues={getFormInitValues()}>
                    <Table
                        scroll={{ x: 1500 }}
                        rowKey={(row: UnMappedColumnDTO) => row.columnName}
                        rowSelection={rowSelection}
                        columns={tbCols}
                        dataSource={unMappedColumns}
                        pagination={false} />
                    <Row>
                        <Col span={4} style={{ marginTop: '16px' }}>
                            <Button type='primary' htmlType='submit'>
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </Form>
            )
        } else {
            return null;
        }
    }

    return (
        <React.Fragment>
            <Row>
                <Col span={4} style={{ textAlign: 'right', padding: '3px 10px' }}>Child entity:</Col>
                <Col span={8}>
                    <Select
                        showSearch
                        value={entityName}
                        optionFilterProp="children"
                        onChange={onChildEntitySelectChanged}
                        style={{ width: '100%' }}>
                        {getEntitySelectOptions()}
                    </Select>
                </Col>
            </Row>
            {getForm()}
        </React.Fragment>
    )
}

export default ManyToOneCreator;