
const initState = [] //初始化

export default function countReducer(preState = initState, action) {
	//从action对象中获取：type、data
	const {type,data} = action
	//根据type决定如何加工数据
	switch (type) {
    case "INITNODES": //初始化节点
      preState.zNodes = data
      console.log("-----------",preState.zNodes)
			return preState.zNodes
    case "ADDNODES": //添加节点
      console.log(preState)
      preState.push(data)
      return preState
		default:
			return preState
	}
}