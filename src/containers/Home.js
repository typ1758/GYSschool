import React,{Component} from 'react'

import { Link } from 'react-router-dom';
import {
    List,
    InputItem,
    WhiteSpace
} from 'antd-mobile';

export default class Home extends Component{
    constructor(props){
        super(props)
    }
    changeInputValue(e) {
      console.log(e)
    }
    render(){
        return (
            <div>
            <div>首页</div>
            <InputItem
            clear
            onChange = {this.changeInputValue}
            placeholder="auto focus"
            ref={el => this.autoFocusInst = el}
          >标题</InputItem>
            <Link to={{ pathname: '/test', search: '?name=homename', state: { mold: 'add' },aa:'dddd' }} className="home-link">
                  点击跳转到路由参数search，state使用
              </Link>
              </div>
        )
    }
}
