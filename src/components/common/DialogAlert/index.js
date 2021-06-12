import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.less';

class DialogBox extends Component {
  constructor(props){
    super(props);
    this.state = {
      type: "form",
      alertStatus: false, //是否显示提示框

      alertTitle:'提示', //标题
      alertTip:'网络错误', //提示
      cancelText:'取消',
      confirmText:'确认',

      isShortTip:false, //是否为短提示，短提示的情况下不显示'取消''确认'（且2s后消失），且优先级最高，其他配置无效

      isShowCancel:true, //是否显示确认按钮
      isShowConfirm:true, //是否显示确认按钮

      cancelCallbackFn:function(){}, //取消 回调函数
      confirmCallbackFn:function (){}//确认 回调函数
    }
  }

  //打开提示框
  open = (options) => {
    options = options || {};
    
    //如果是短提示
    if(options.isShortTip){
      options.isShowCancel = false;
      options.isShowConfirm = false;
      setTimeout(()=>{
        this.close()
      },2000)
    }

    options.alertStatus = true;
    this.setState({
      ...options
    })
  }
  //取消
  cancel = () => {
    this.state.cancelCallbackFn();
    this.close()
  }
  //确认
  confirm = () => {
    this.state.confirmCallbackFn();
    this.close()
  }
  close = () => {
    this.setState({
      alertStatus:false
    })
  }

  render(){
    let opts = this.state;
    return (
      <div className="mask-layer" style={opts.alertStatus ? { display: 'block' } : { display: 'none' }}>
        <div className="dialog-wrap">
          <div className="dialog-title">
            <span>{opts.alertTitle}</span>
            <span className="close-dialog" onClick={ ()=> this.cancel() }></span>
          </div>
          <div className="dialog-box">
            {opts.alertTip}
            {
              // opts.type !== "form" ? (
                !opts.isShowCancel && !opts.isShowConfirm ? null : (
                  <div className="dialog-footer">
                    {opts.isShowCancel ? (<button className="dialog-btn dialog-btn-cancel" onClick={ () => this.cancel() }>{opts.cancelText}</button>) : null}
                    {opts.isShowConfirm ? (<button className="dialog-btn dialog-btn-confirm" onClick={ () => this.confirm() }>{opts.confirmText}</button>) : null}
                  </div>
                  )
              // ) : null
            }
          </div>
        </div>
      </div>
    )
  }
}

let div = document.createElement('div');
document.body.appendChild(div);
let DialogAlert = ReactDOM.render(<DialogBox /> ,div); //返回实例

export default DialogAlert;