import React, { PureComponent } from 'react'
import { Form, Input, Button } from 'antd';
import project from "assets/img/operation/project.png";
import link from "assets/img/operation/link.png";

class OperationsPane extends PureComponent {
  state = {
    isSaved: false //已保存
  }

  componentDidMount(){
    
  }

  onProjectFinish = (res) => {
    
  }

  render(){
    return (
      <div style={{ padding: "32px 52px"}}>
        <div className="card-form">
          <div className="card-title">
            <img className="card-title-icon" src={ project } alt=""/>
            <span>项目管理</span>
          </div>
          <Form onFinish={this.onProjectFinish} className="form">
            <Form.Item label="项目名称">
              <Input />
            </Form.Item>
            <Form.Item label="服务器IP">
              <Input />
            </Form.Item>
            <Form.Item label="服务端口">
              <Input />
            </Form.Item>
            <Form.Item className="form-footer">
              <Button type="primary" htmlType="submit" className={`${this.state.isSaved ? "saved" : ""}`}>保存</Button>
            </Form.Item>
          </Form>
        </div>

        <div className="card-form">
          <div className="card-title">
            <img className="card-title-icon" src={ link } alt=""/>
            <span>远程运维连接信息</span>
          </div>
          <Form onFinish={this.onProjectFinish} className="form">
            <Form.Item label="验证码">
              <Input />
            </Form.Item>
            <Form.Item label="节点ID">
              <Input className="ant-input-text" disabled/>
            </Form.Item>
            <Form.Item className="form-footer">
              <Button type="primary" htmlType="submit">复制连接信息</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}

export default OperationsPane
