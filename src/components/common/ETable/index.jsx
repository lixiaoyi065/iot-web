import React from 'react'
import { Table } from 'element-react'

export default class ETable extends React.Component {
  state = {
    dataSource: []
  }

  // componentDidMount() {
    
  // }
  
  // static getDerivedStateFromProps(props, state) {
  //   state.dataSource = props.dataSource
  //   return null
  // }

  render(){
    return (
      <Table
        columns={this.props.columns}
        data={this.state.dataSource}
      />
    )
  }
}