import React,{Component} from 'react'
import {
    Button
} from 'antd';

export default class Profile extends Component{
    componentWillMount (){
        console.log('===========profile')
        console.log(this.props)
    }
    render(){
        return (
            <div>个人中心<Button type="primary">Primary</Button></div>
        )
    }
}
