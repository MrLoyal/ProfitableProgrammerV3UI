import React, { useState } from 'react';
import { Table, Form, Input } from 'antd';
import { TableRowSelection, Key } from 'antd/lib/table/interface';

export interface EntityBasicProperty {
    javaType: string,
    name: string
}

export interface BasePropsTableProps {
    basicPropsList?: Array<EntityBasicProperty>,
    basicPropSelectedHandler?: Function
}

const columns = [
    {
        title: 'Entity prop name',
        render: (t: string, r: EntityBasicProperty, i: number) => r.name
    },
    {
        title: 'Java type',
        render: (t: string, r: EntityBasicProperty, i: number) => r.javaType
    },
    // {
    //     title: 'DTO type',
    //     render: (t: string, r: EntityBasicProperty, i: number) => (
    //         <Form.Item name={'dtoType_' + r.name}>
    //             <Input />
    //         </Form.Item>
    //     )
    // },
    // {
    //     title: 'Map as',
    //     render: (t: string, r: EntityBasicProperty, i: number) => r.name
    // },
]

function BasicPropsTable(props: BasePropsTableProps) {
    const [selectedRowKeys, setSelectedRowKeys] = useState(new Array<Key>());

    const tableRowSelection: TableRowSelection<EntityBasicProperty> = {
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedKeys) => {
            setSelectedRowKeys(selectedKeys);
            if(props.basicPropSelectedHandler){
                props.basicPropSelectedHandler(selectedKeys);
            }
        }
    }
    return (
        <Table
            rowKey={(row: EntityBasicProperty) => row.name}
            pagination={false}
            columns={columns}
            dataSource={props.basicPropsList}
            rowSelection={tableRowSelection} />
    );
}

export default BasicPropsTable;