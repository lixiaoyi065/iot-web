/* 
	1.该文件是用于创建一个为Count组件服务的reducer，reducer的本质就是一个函数
	2.reducer函数会接到两个参数，分别为：之前的状态(preState)，动作对象(action)
*/
import {INITNODES,ADDNODES, DELNODES} from './constant'

const initState = [] //初始化

export default function countReducer(preState = initState, action) {
	//从action对象中获取：type、data
	const {type,data} = action
	//根据type决定如何加工数据
	switch (type) {
    case INITNODES: //初始化节点
			return data
    case ADDNODES: //添加节点
      let newAyy = [];
      preState.forEach((e) => {
        newAyy.push(e)
      })
      newAyy.push(data)
      return newAyy
    case DELNODES: //删除节点
      let newArr = [];
      preState.forEach((e) => {
        if (e.nodeID !== data) {
          newArr.push(e)
        }
      })
      return newArr
    case "addGroup": //删除节点的分组
      let newArr2 = [];
      preState.forEach((e) => {
        if (e.nodeID !== data) {
          newArr2.children.push(e)
        }
      })
      return newArr2
		default:
			return preState
	}
}