import React, { useState } from 'react';
import { ManyToOneEntityAndBasicProps } from './ManyToOnePropsTables';
import { TableRowSelection, Key } from 'antd/lib/table/interface';
import { Table } from 'antd';
import { EntityBasicProp } from '../store/dtogenerator/types';

export interface ExpandedRowM2oProps {
    manyToOneEntity: ManyToOneEntityAndBasicProps,
    propSelectedHandler: Function
}

function ExpandedRowM2o(props: ExpandedRowM2oProps) {
    const [keys, setKeys] = useState(new Array<Key>());

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name'
        }
    ]
    const rowSelection: TableRowSelection<ManyToOneEntityAndBasicProps> = {
        selectedRowKeys: keys,
        onChange: (selectedRowKeys => {
            setKeys(selectedRowKeys);
            props.propSelectedHandler(props.manyToOneEntity.name, selectedRowKeys);
        })
    }
    return (
        <Table
            size='small'
            rowKey={(row: EntityBasicProp) => row.name}
            columns={columns}
            dataSource={props.manyToOneEntity.basicProperties}
            rowSelection={rowSelection}
        />
    )
}

export default ExpandedRowM2o;