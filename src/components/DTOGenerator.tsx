import React, { Fragment, useEffect, useState } from 'react';

import { DTOGeneratorProps } from "../store/dtogenerator/types";
import { Row, Col, Select, Tabs, Input, Form, Button, notification, Checkbox } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { listEntities } from '../store/manytoone/actions';
import { RootState } from '../store/index';
import BasicPropsTable from './BasicPropsTable';
import { listEntityProperties } from '../store/dtogenerator/actions'
import { Store } from 'antd/lib/form/interface';
import { toWrapperType } from '../utils';
import ManyToOnePropsTable from './ManyToOnePropsTables';

import Agent from '../agent/axios';

const { Option } = Select;

interface M2oSelect {
    m2oName: string;
    selected?: Array<string>;
}

function DTOGenerator(props: DTOGeneratorProps) {
    const dispatch = useDispatch();
    const [dtoName, setDtoName] = useState('');
    const [entityName, setEntityName] = useState('');
    // const [genListItemRepo, setGenListItemRepo] = useState(false);
    // const [genDetailsRepo, setGenDetailsRepo] = useState(false);
    const [repoType, setRepoType] = useState('LIST_ITEM');
    const [basicSelectedKeys, setBasicSelectedKeys] = useState(new Array<string>());
    const [form] = Form.useForm();
    const entityList = useSelector((state: RootState) => state.manyToOne.entityList);
    const basicPropsList = useSelector((state: RootState) => state.dtoGenerator.entityBasicProperties);
    const m2oPropsList = useSelector((state: RootState) => state.dtoGenerator.m2oPropList);
    const [m2oSelection, setM2oSelection] = useState(new Array<M2oSelect>());

    useEffect(() => {
        dispatch(listEntities());
    }, [dispatch])

    useEffect(() => {
        if (basicPropsList && basicPropsList.length > 0) {
            const store: Store = {}
            basicPropsList.forEach(prop => {
                const name: string = 'dtoType_' + prop.name;
                store[name] = toWrapperType(prop.javaType);
            })
            form.setFieldsValue(store);
        }

    }, [basicPropsList, form])

    function onEntitySelectionChange(value: string) {
        console.log("EntitySelectionChanged: ", value);
        setEntityName(value);
        let dtoName = value + "DTO";
        setDtoName(dtoName);

        dispatch(listEntityProperties(value));
    }

    function renderEntityListOptions(): any {
        if (!entityList || entityList.length === 0) {
            return null;
        }

        return entityList.map((entityName: string) => {
            return <Option key={entityName} value={entityName}>{entityName}</Option>
        })
    }

    function onFormFinish(values: any) {

        const data = {
            entityName: entityName,
            basicProps: basicSelectedKeys,
            dtoName: dtoName,
            m2oSelection: m2oSelection,
            repoType: repoType
            // genListItemRepo: genListItemRepo,
            // genDetailsRepo: genDetailsRepo
        };

        console.log("Now POST this data: ", data);

        Agent.createDTO(data)
            .then(resp => {
                console.log(resp);
                notification.success({
                    message: 'Success',
                    description: 'DTO created successfully!'
                })
            })
            .catch((error: any) => {
                console.log(error)
                let msg = JSON.stringify(error);
                if (error.message) {
                    msg = error.message;
                }
                notification.error({
                    message: 'Error',
                    description: msg
                })
            })
    }

    function basicPropSelectedHandler(keys: Array<string>) {
        console.log("[basicPropSelectedHandler]: ", keys);
        setBasicSelectedKeys(keys);
    }

    function manyToOneEntityPropSelectedHandler(m2oName: string, keys: Array<string>) {
        console.log("manyToOneEntityPropSelectedHandler ... ", m2oName, keys);
        const a = getM2oSelect(m2oName);
        if (!a) {
            m2oSelection.push({
                m2oName: m2oName,
                selected: keys
            })
        } else {
            a.selected = keys;
        }
        console.log(m2oSelection);
        setM2oSelection(m2oSelection);
    }

    function getM2oSelect(m2oName: string): M2oSelect | null {
        for (let i = 0; i < m2oSelection.length; i++) {
            const a = m2oSelection[i];
            if (a.m2oName === m2oName) {
                return a;
            }
        }
        return null;
    }

    // function onGenListItemRepoChanged(evt: any){
    //     const checked: boolean = evt.target.checked;
    //     setGenListItemRepo(checked);
    // }

    // function onGenDetailsRepoChanged(evt: any){
    //     const checked: boolean = evt.target.checked;
    //     setGenDetailsRepo(checked);
    // }

    function onRepoTypeChanged(value: string) {
        setRepoType(value);
        if (value === 'DETAILS') {
            let dtoName = entityName + "DetailsDTO";
            setDtoName(dtoName);
        } else if (value === 'LIST_ITEM') {
            let dtoName = entityName + "DTO";
            setDtoName(dtoName);
        }

    }

    return (
        <Fragment>
            <Row>
                <Col span={4}>
                    Select an entity:
                </Col>
                <Col span={8}>
                    <Select
                        showSearch
                        onChange={onEntitySelectionChange}
                        style={{ width: '100%' }}>
                        {renderEntityListOptions()}
                    </Select>
                </Col>
            </Row>
            <Row style={{ marginTop: '16px' }}>
                <Col span={4}>
                    DTO name:
                </Col>
                <Col span={8}>
                    <Input value={dtoName} onChange={(value) => setDtoName(value.target.value)} />
                </Col>
            </Row>
            <Row style={{ marginTop: '16px' }}>
                <Col span={4}>
                    Generate repository:
                </Col>
                <Col span={8}>
                    {/* <Checkbox checked={genListItemRepo} onChange={onGenListItemRepoChanged} >List item</Checkbox>
                    <Checkbox checked={genDetailsRepo} onChange={onGenDetailsRepoChanged} >Details</Checkbox> */}
                    <Select value={repoType} onChange={onRepoTypeChanged} style={{ width: '100%' }}>
                        <Select.Option key={0} value={'NONE'}>None</Select.Option>
                        <Select.Option key={1} value={'LIST_ITEM'}>List Item</Select.Option>
                        <Select.Option key={2} value={'DETAILS'}>Details</Select.Option>
                    </Select>
                </Col>
            </Row>

            <Form form={form} onFinish={onFormFinish}>
                <Tabs>
                    <Tabs.TabPane key={1} tab={'Basic properties'}>
                        <BasicPropsTable
                            basicPropSelectedHandler={basicPropSelectedHandler}
                            basicPropsList={basicPropsList} />
                    </Tabs.TabPane>
                    <Tabs.TabPane key={2} tab={'ManyToOne properties'}>
                        <ManyToOnePropsTable
                            propSelectedHandler={manyToOneEntityPropSelectedHandler}
                            m2oPropsList={m2oPropsList} />
                    </Tabs.TabPane>
                </Tabs>

                <Button style={{ marginTop: '10px' }} type='primary' htmlType='submit'>Let's go</Button>
            </Form>

        </Fragment>
    );

}

export default DTOGenerator;