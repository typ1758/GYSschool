import React from "react";
import './index.css'
import {
    Link
} from 'react-router-dom';
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
    message,
    Pagination 
} from 'antd';
const {
    Option
} = Select;



const AutoCompleteOption = AutoComplete.Option;

 
const residences = [{
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [{
            value: 'hangzhou',
            label: 'Hangzhou',
            children: [{
                value: 'xihu',
                label: 'West Lake',
            }, ],
        }, ],
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [{
            value: 'nanjing',
            label: 'Nanjing',
            children: [{
                value: 'zhonghuamen',
                label: 'Zhong Hua Men',
            }, ],
        }, ],
    },
];
class MyRegister extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
            visible: false,
            resultflg:false,
            noticedata:[],
        };
    }
    componentDidMount(){
        this.noticelist()
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    visible: true,
                    resultflg:true,
                  });
            }
        });
    };
    handleOk = e => {
        this.setState({
          visible: false,
        });
      };
    
      handleCancel = e => {
        this.setState({
          visible: false,
        });
      };
      noticelist = ()=>{
        let _this=this
        let data = {
            pageNum: 1, //,
            pageSize: 10, //,
        }
        axios.get(config.host + '/api/system/notice/list?pageNum=1&pageSize=10')
        .then(function (response) {
            let data=response.data
            if(data.code!==0){
                message.error(data.msg);
                return
            }
            _this.setState({
                noticedata:response.data.data.rows,
                total: response.data.data.total
            })
        })
        .catch(function (error) {
            console.log(error);
        });
      }
      
      noticedata=(id)=>{
          this.props.history.push('/details/'+id)
      }
    render(){
        const {
            noticedata,
            total
        } = this.state
         return(
         <div>
            <Card>
            <div className='annout_box'>
                    <ul>
                        {
                            noticedata.map((v,i)=>(
                                <Link to = { '/details/' + v.noticeId } key={i} className='anmoulist'>
                                    <li  >
                                        <p className='annout_left' dangerouslySetInnerHTML={{ __html: v.noticeTitle }} />
                                        <p className='annout_right'>{v.createTime}</p>
                                    </li>
                                </Link>
                            ))
                        }
                    </ul>
                    
                </div>
                <div className='Pagination'>
                    <Pagination defaultCurrent={1} total={total} />
                </div>
                
                
            </Card>
        </div>)
    }
 
}
export default Form.create()(MyRegister);