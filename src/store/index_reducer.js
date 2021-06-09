const collapsed = false //初始化

export default  function collapedReducer(preState = collapsed, action) {
	//从action对象中获取：type、data
	const {type} = action
	//根据type决定如何加工数据
	switch (type) {
		case "collapsed": //初始化节点
			const newPreState = !preState
      console.log(newPreState)
			return newPreState
		default:
			return preState
	}
}