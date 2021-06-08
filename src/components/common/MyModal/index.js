import React, { PureComponent } from 'react'
import { Modal } from 'antd'

export default class MyModal extends PureComponent {
  
  render() {
    return (
      <Modal width='fit-content' title={this.props.title}
        { ...this.props }>
        {this.props.children}
      </Modal>
    )
  }
}