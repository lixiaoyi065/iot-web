import React, { PureComponent } from 'react'
import { Modal, message } from 'antd'

import { GetUserList, AddUser, UpdateUser, DeleteUser,UpdateUserPassword } from 'api/user'

import DataTable from 'components/common/Table'
import Search from './components/Search'
import ModifyPw from './components/ModifyPw'
import AddUserPane from './components/AddUser'

import {getCookie} from 'utils'

class UserList extends PureComponent {
  state = {
    dataSource: [],
    count: 0,
    isShow: false,
    modalContent: "",
    selectedRowKeys: []
  }

  componentDidMount() {
    this.GetUserList("");
  }
  //查询用户列表
  GetUserList = (res) => {
    GetUserList(res).then(res => {
      if (res.code === 0) {
        let dataList = [];
        res.data.forEach(el => {
          el.key = el.userID;
          dataList.push(el)
        })

        this.setState({
          dataSource: dataList,
          count: res.data.length
        })
      } else {
        message.error("发生错误："+ res.msg)
      }
    })
  }
  
  //查询
  search = (res) => {
    console.log(res)
    this.GetUserList(res)
  }
  addUserForm = (res) => {
    AddUser(res).then(res => {
      console.log(res)
      if (res.code === 0) {
        message.info("添加成功")
        this.GetUserList("");
        this.setState({
          isShow: false
        })
      } else {
        message.error("添加失败："+ res.msg)
      }
    })
  }
  modifyUserForm = res => {
    UpdateUser(res).then(res => {
      if (res.code === 0) {
        message.info("编辑成功")
        this.GetUserList("");
        this.setState({
          isShow: false
        })
      } else {
        message.error("编辑失败："+ res.msg)
      }
    })
  }
  //添加用户
  addUser = () => {
    this.setState({
      isShow: true,
      modalContent: <AddUserPane key={ Date() } onCancel={this.onCancel} onFinish={ this.addUserForm }/>
    })
  }
  //编辑用户
  modifyUser = (obj) => {
    this.setState({
      isShow: true,
      modalContent: <AddUserPane key={ Date() } userkey={ obj } onCancel={this.onCancel} onFinish={ this.modifyUserForm }/>
    })
  }
  //删除用户
  delUser = () => {
    if (this.state.selectedRowKeys.length > 0) {
      DeleteUser(this.state.selectedRowKeys).then(res => {
        if (res.code === 0) {
          message.info("删除成功")
          this.GetUserList("");
        } else {
          message.error("删除失败："+ res.msg)
        }
      })
    } else {
      message.error("请选择要删除的节点")
    }
  }
  //修改密码提交表单
  ModifyPwForm = (key, res) => {
    UpdateUserPassword({
      userID: key,
      userPassword: res.userPassword
    }).then(res => {
      console.log(res)
    })
  }
  //修改密码
  modifyPw = (key) => {
    this.setState({
      isShow: true,
      modalContent: <ModifyPw userkey={key} onCancel={this.onCancel} onFinish={ (res)=>{this.ModifyPwForm(key,res)} }/>
    })
  }

  onCancel = () => {
    this.setState({isShow: false})
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };
  
  render() {

    return (
      <div className="tableList" style={{'paddingLeft': '25px'}}>
        <Search searchForm={this.search} addUser={this.addUser} delUser={ this.delUser }/>
        <div className="tableContain">
          <DataTable
            dataSource={this.state.dataSource}
            rowSelection={{
              columnWidth: "50px",
              selectedRowKeys: this.state.selectedRowKeys,
              onChange: this.onSelectChange,
            }}
            loadMore={this.loadMore}
            count={this.state.count}
            columns={[
            {
              title: '序号',
              dataIndex: 'key',
              width: "70px",
              render: (key, i) => {
                return <span className="serialNum">{this.state.dataSource.indexOf(i) + 1}</span>
              }
            },
            {
              title: '用户账号',
              dataIndex: 'userAccount',
            },
            {
              title: '用户名称',
              dataIndex: 'userName',
            },
            {
              title: '电话号码',
              dataIndex: 'phone',
              width: '200px',
            },
            {
              title: '操作',
              dataIndex: 'userID',
              render: (key, obj) => {
                if (obj.userAccount === "SuperAdmin") {
                  return <></>
                } else {
                  return (
                    <>
                      <button className="ant-opt-btn" onClick={() => {
                      this.modifyUser(obj)
                    }}>编辑</button>
                      {
                        getCookie("userName") === "SuperAdmin" ? (
                          <button className="ant-opt-btn ant-opt-btn-normal"
                            onClick={() => { this.modifyPw(key)} } style={{ "marginLeft": "20px" }}>修改密码</button>
                        ): (
                            <></>
                        )
                      }
                    </>
                  )
                }
              }
            }
          ]} />
          
          <Modal
            title="修改密码"
            visible={this.state.isShow}
            onCancel={this.onCancel}
            footer={null}
            width="460px"
          >
          {
            this.state.modalContent
          }
          </Modal>
        </div>
      </div>
    )
  }
}

export default UserList