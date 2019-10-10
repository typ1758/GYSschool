import React,{Component} from 'react'
import {
    Modal,
    Result,
    Button
} from 'antd';
export default class Add extends Component{
      constructor(props, context) {
          super(props, context);
          this.state = {
              paramsArry: '',
              seconds: 5,
          };
      }
    componentDidMount() {
        let dataParams = JSON.parse(localStorage.getItem('params'))
        this.setState({
            paramsArry: dataParams
        })
        this.countDown()
        let timer = setInterval(() => {
            this.setState((preState) => ({
                seconds: preState.seconds - 1,
            }), () => {
                if (this.state.seconds == 0) {
                    clearInterval(timer);
                }
            });
        }, 1000)
    }
    countDown = () => {
        let secondsToGo = 5;
        const modal = Modal.success({
            title: '系统消息',
            okText: '知道了',
            content: `将在 ${secondsToGo} 秒后跳转到支付页面.`,
        });
        const timer = setInterval(() => {
            secondsToGo -= 1;
            modal.update({
                content: `将在 ${secondsToGo} 秒后跳转到支付页面.`,
            });
        }, 1000);
        setTimeout(() => {
            clearInterval(timer);
            modal.destroy();
            document.forms[0].submit()
        }, secondsToGo * 1000);
    }
    render(){

        const {
            paramsArry,
            seconds
        } = this.state
        return (
            <div>
            <Result
                status="success"
                title="订单已提交成功"
                subTitle = {
                    `将在 ${seconds} 秒后跳转到支付页面.`
                }
            />
                        <form name='payFrom' method='post' action={paramsArry.action}>
                        <input type='hidden' name='json' value={paramsArry.json}/>
                        <input type='hidden' name='signature' value={paramsArry.signature}/>
                        </form>
            </div>
        )
    }
}
