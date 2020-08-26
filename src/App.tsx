import React from 'react';

import { Layout, Menu, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { NavLink, Switch, Route } from 'react-router-dom';

import './App.css';
import SubMenu from 'antd/lib/menu/SubMenu';
import EntityGenerator from './components/EntityGenerator';
import ManyToOneCreator from './components/ManyToOneCreator';
import DTOGenerator from './components/DTOGenerator';

const { Sider, Header, Footer, Content } = Layout;

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider style={{ height: 'unset' }}
        trigger={<p>Trigger</p>}
        collapsed={false}>
        <div className='logo' style={{ textAlign: 'center' }}>
          <NavLink to="/">
            <h1 style={{ color: '#fff', fontSize: '30px' }}>PPv3</h1>
          </NavLink>
        </div>
        <Menu theme='dark' mode='inline' defaultOpenKeys={['1', '2']}>
          <SubMenu title="Entity" key='1'>
            <Menu.Item title='Generate entity' key='1.1'>
              <NavLink to='/generate-entity'>Generate entity</NavLink>
            </Menu.Item>
            <Menu.Item title='Add ManyToOne' key='1.2'>
              <NavLink to='/many-to-one-creator'>Add ManyToOne</NavLink>
            </Menu.Item>
          </SubMenu>
          <SubMenu title="Data Transfer Object" key='2'>
          <Menu.Item title='Generate entity' key='2.1'>
              <NavLink to='/dto-generator'>DTO Generator</NavLink>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout>
        {/* , display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end' */}
        <Header style={{ backgroundColor: '#fff', padding: '0 16px' }}>
          <div className='header-container'>
            <div className="header-item">
              <span className="sider-toggle">
                {/* {React.createElement(menuCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined)} */}
              </span>
            </div>
            <div className="header-divider"></div>
            <p className="header-item" style={{ padding: '0 10px' }}>
              Hello my Boss
            </p>
            <Avatar className="" icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />
          </div>

        </Header>
        <Layout>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div className="site-layout-background" style={{ minHeight: '100%', padding: 24, backgroundColor: '#fff' }}>
              <Route path='/generate-entity' component={EntityGenerator} />
              <Route path='/many-to-one-creator' component={ManyToOneCreator} />
              <Route path='/dto-generator' component={DTOGenerator} />

            </div>
          </Content>
          <Switch>
          </Switch>
          <Footer style={{ textAlign: 'center' }}>Bản quyền 2020 - Zamio Việt Nam</Footer>
        </Layout>

      </Layout>
    </Layout>
  );
}

export default App;
