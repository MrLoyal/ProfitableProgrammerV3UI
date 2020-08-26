import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { EntityManyToOneProperty, EntityBasicProp } from '../store/dtogenerator/types';
import { useDispatch, useSelector } from 'react-redux';
import { listM2oBasicProperties } from '../store/dtogenerator/actions';
import { RootState } from '../store';
import { EntityBasicProperty } from './BasicPropsTable';
import { Key, TableRowSelection } from 'antd/lib/table/interface';
import ExpandedRowM2o from './ExpandedRowM2o';

export interface ManyToOnePropsTableProps {
    m2oPropsList?: Array<EntityManyToOneProperty>,
    propSelectedHandler: Function
}

export interface ManyToOneEntityAndBasicProps {
    name: string,
    javaType: string,
    basicProperties?: Array<EntityBasicProp>
}

const columns = [
    {
        title: 'Property',
        render: (t: string, r: EntityManyToOneProperty, i: number) => (
            <span>
                <span>{r.name}: </span>
                <strong>{r.javaType}</strong>
            </span>
        )
    }
]

function ManyToOnePropsTable(props: ManyToOnePropsTableProps) {
    const mp = props.m2oPropsList;
    const dispatch = useDispatch();
    // const [dataSource, setDataSource] = useState(new Array<ManyToOneEntityAndBasicProps>());
    const basicPropsOfM2o = useSelector((state: RootState) => state.dtoGenerator.basicPropsOfM2o);


    useEffect(() => {
        if (props.m2oPropsList) {
            const names = new Array<string>();
            props.m2oPropsList.forEach(prop => {
                if (!names.includes(prop.javaType)) {
                    dispatch(listM2oBasicProperties(prop.javaType));
                    names.push(prop.javaType);
                }
            })
        }
    }, [mp]);



    const expandedRowRender = function (r: ManyToOneEntityAndBasicProps) {
        return (
            <ExpandedRowM2o
                manyToOneEntity={r}
                propSelectedHandler={props.propSelectedHandler} />
        )
    };

    function merge(): Array<ManyToOneEntityAndBasicProps> {
        const res = new Array<ManyToOneEntityAndBasicProps>();
        if (props.m2oPropsList) {
            props.m2oPropsList.forEach(m2o => {
                let basicProperties;
                if (basicPropsOfM2o && basicPropsOfM2o.length > 0) {
                    for (let i = 0; i < basicPropsOfM2o.length; i++) {
                        // debugger;
                        const entityName = basicPropsOfM2o[i].entityName;
                        if (entityName === m2o.javaType) {
                            basicProperties = basicPropsOfM2o[i].basicProperties
                        }
                    }
                } else {
                    console.log("basicPropsOfM2o is empty");
                }
                const aaa: ManyToOneEntityAndBasicProps = {
                    name: m2o.name,
                    javaType: m2o.javaType,
                    basicProperties: basicProperties
                }

                res.push(aaa);
            })
        }

        return res;
    }

    const dts = merge();
    // setDataSource(dts);
    console.log("dataSource: ", dts);

    return (
        <Table
            rowKey={(row: EntityManyToOneProperty) => row.javaType + '_' + row.name}
            columns={columns}
            dataSource={dts}
            expandable={{ expandedRowRender: expandedRowRender }}
        />
    )
}

export default ManyToOnePropsTable;