/* 
	该文件专门为Count组件生成action对象
*/
import {INITNODES,ADDNODES} from './constant'

export const createInitNodesAction = data => ({type:INITNODES,data})
export const createAddNodesAction = data => ({type:ADDNODES,data})
