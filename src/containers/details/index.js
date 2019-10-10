import React from "react";
import './index.css'
import axios from 'axios';
import qs from 'qs';
import config from './../../store/config'
import {
    Form,
    Input,
    Tooltip,
    Icon,
    Cascader,
    Select,
    Row,
    Col,
    Checkbox,
    Button,
    Card,
    Modal,
    Radio,
    AutoComplete,
    Pagination 
} from 'antd';


class MyRegister extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state = {
            noticedata:[],
        };
    }
    componentDidMount(){
        this.noticelist()
    }
     
    noticelist = ()=>{
    let _this=this
    axios.get(config.host + '/api/system/notice/detail?noticeId=' + _this.props.match.params.id)
    .then(function (response) {
        _this.setState({
            noticedata:response.data.data,
        })
    })
    .catch(function (error) {
        console.log(error);
    });
    }
      
    render(){
        const {noticedata} = this.state
         return(
         <div>
            <Card>
                <div className='detaildbox'>
                    <h3>{noticedata.noticeTitle}</h3>
                    <p ><span className='createBy'>{noticedata.createBy}</span><span>{noticedata.createTime}</span></p>
                </div>
                <div>
                <p className='annout_left' dangerouslySetInnerHTML={{ __html: noticedata.noticeContent }} />
                </div>
            </Card>
        </div>)
    }
 
}
export default Form.create()(MyRegister);