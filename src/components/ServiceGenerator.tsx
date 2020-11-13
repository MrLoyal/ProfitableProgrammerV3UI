import React, { Fragment, useEffect, useState } from 'react';

import { Row, Col, Select, Form, Button, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { listEntities } from '../store/manytoone/actions';
import { listDTOs } from '../store/servicegenerator/actions'
import { RootState } from '../store/index';

import Agent from '../agent/axios';
import { ServiceGeneratorProps } from '../store/servicegenerator/types';

const { Option } = Select;

interface M2oSelect {
    m2oName: string;
    selected?: Array<string>;
}


function ServiceGenerator(props: ServiceGeneratorProps) {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const entityList = useSelector((state: RootState) => state.manyToOne.entityList);
    const dtoList = useSelector((state: RootState) => state.servicegenerator.dtoList);

    useEffect(() => {
        dispatch(listEntities());
        dispatch(listDTOs())
    }, [dispatch])

    function onFormFinish(values: any) {
        console.log("Form values: ", values);
        Agent.createService(values)
        .then(resp => {
            notification.success({
                message: 'Success',
                description: 'Service created successfully!'
            })
        })
        .catch(e => {
            notification.error({
                message: 'Error',
                description: 'An error occurred!!!'
            })
        })
    }

    const entitySelect = () => {
        if (!entityList || entityList.length === 0) {
            return (
                <Select></Select>
            );
        } else {
            return (
                <Select showSearch>
                    {entityList.map(entity => (
                        <Option value={entity} key={entity}>
                            {entity}
                        </Option>
                    ))}
                </Select>
            )
        }
    }

    const dtoSelect = () => {
        if (!dtoList || dtoList.length === 0) {
            return (
                <Select></Select>
            );
        } else {
            return (
                <Select showSearch>
                    {dtoList.map(dto => (
                        <Option value={dto} key={dto}>
                            {dto}
                        </Option>
                    ))}
                </Select>
            )
        }
    }

    const layout: any = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    }

    return (
        <Fragment>
            <Form {...layout} form={form} layout='horizontal' onFinish={onFormFinish}>
                <Row>
                    <Col span={12}>
                        <Form.Item name='entityName' label='Entity'>
                            {entitySelect()}
                        </Form.Item>
                        <Form.Item name='listItemDTO' label='List item DTO'>
                            {dtoSelect()}
                        </Form.Item>
                        <Form.Item name='detailsDTO' label='Details DTO'>
                            {dtoSelect()}
                        </Form.Item>
                    </Col>
                </Row>

                <Button style={{ marginTop: '10px' }} type='primary' htmlType='submit'>Let's go</Button>
            </Form>

        </Fragment>
    );

}

export default ServiceGenerator;