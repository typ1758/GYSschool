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
} from 'antd';
import { Z_BUF_ERROR } from "zlib";
const {
    Option
} = Select;



const AutoCompleteOption = AutoComplete.Option;

class MyRegister extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
            visible: false,
            resultflg:false,
            btnloading:false,
            querySignUp:'',
            allExamvalue: []
        };
    }
    componentDidMount(){
        this.allExam()
    }
    handleSubmit = e => {
        let _this = this
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                _this.setState({
                    btnloading:true,
                })
                let data={
                    nExamId:values.nExamId.split('_')[0],
                    cIdCard:values.idcard,//,
                    cName:values.nickname,//,
                    cPhone:values.phone,//,
                }
                axios.post(config.host + '/api/school/sign/querySignUp', qs.stringify(data))
                .then(function (response) {
                    _this.setState({
                        btnloading:false,
                    })
                    let data=response.data
                    if(data.code===500){
                        _this.setState({
                            visible:true,
                        })
                    }else{
                        _this.setState({
                            resultflg:true,
                            querySignUp:data.data,
                        })
                    }
                    _this.setState({
                        detaildata:response.data.data,
                    })
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        });
    };
    allExam = () => {
        let _this=this
        axios.get(config.host + '/api/school/exam/allExam')
        .then(function (response) {
            let res=response.data.data
            console.log(res)
            let allExamlist = []
            res.map((v,i)=>{
                allExamlist.push({dictLabel:v.dictLabel,dictValue:v.dictValue})
            })
             _this.props.form.setFieldsValue({
                nExamId: res[0].dictValue + '_' + res[0].dictLabel
            })
            _this.setState({
                allExamvalue:allExamlist
            })
        })
        .catch(function (error) {
            console.log(error);
        });
    }
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

      idcardvalidation= (rule, value, callback) => {
          console.log(value)
        var reg = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/;
        if (value&&!(reg.test(value))){
            callback('请输入正确的身份证号码'); // 校验未通过
        }
    
        callback(); // 校验通过
    
    }
    surebtn = () => {
        this.setState({
            resultflg: false,
          });
    }
    phonevalidation = (rule, value, callback) => {
            if (value&&!(/^1[3456789]\d{9}$/.test(value))){
                callback('请输入正确的手机号'); // 校验未通过
            }
        
            callback(); // 校验通过
        
        }
    render(){
            const { getFieldDecorator } = this.props.form;
            const { autoCompleteResult,querySignUp ,allExamvalue} = this.state;
            
            const formItemLayout = {
                labelCol: {
                    xs: { span: 3 },
                    sm: { span: 3 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 12 },
                },
            };
            const tailFormItemLayout = {
                wrapperCol: {
                    xs: {
                    span: 24,
                    offset: 0,
                    },
                    sm: {
                    span: 16,
                    offset: 8,
                    },
                },
            };
        return(<div>
            <Card>
            <Modal
                title="温馨提示"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={null}
                > 
                    <div className='nohave_box'>
                        <img src={require("./../../images/no.png")} alt="" width='50%'/>
                        <p>暂未查询到您的报考信息</p>
                    </div>
                </Modal>
                {
                    this.state.resultflg===false?<Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item
                        label={
                            <span> 考试计划</span>
                        }
                    >
                    {
                        getFieldDecorator('nExamId', {
                            rules: [{
                                required: true,
                                message: ' 请选择考试计划!',
                                whitespace: true
                            }],
                        })(  <Select
                        // value={'a'}
                        // size={size}
                        style={{ width: '100%' }}
                        onChange={this.categoryChange}
                        >
                            {/* <Option  value='3_社会人士' disabled={true}>社会人士</Option> */}
                            {
                                allExamvalue.map((v,i)=>(
                                    <Option    key={i} value={v.dictValue+'_'+v.dictLabel} >{v.dictLabel}</Option>
                                ))
                            }
                        
                    </Select> )
                    }
                  
                    </Form.Item>
                    <Form.Item
                        label={
                            <span>考生姓名</span>
                        }
                    >
                    { getFieldDecorator('nickname', {
                        rules: [{
                            required: true,
                            message: ' 请输入考生姓名!',
                            whitespace: true
                        }],
                    })(<Input />)}
                    </Form.Item>
                    <Form.Item
                        label={
                            <span> 身份证号</span>
                        }
                    >
                    { getFieldDecorator('idcard', {
                        rules: [{
                            required: true,
                            message: ' 请输入身份证号!',
                            whitespace: true
                        },{
                            validator: this.idcardvalidation
                            }
                        ],
                    })(<Input />)}
                    </Form.Item>
                    <Form.Item
                        label={
                            <span> 电话号码</span>
                        }
                    >
                    { getFieldDecorator('phone', {
                        rules: [{
                            required: true,
                            message: ' 请输入电话号码!',
                            whitespace: true
                        },{
                            validator: this.phonevalidation
                            }],
                    })(<Input />)}
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" loading={this.state.btnloading}>
                        立即查询
                        </Button>
                    </Form.Item>
                </Form>:<div className='results_box'>
                    <div className='headbox'>
                        <img src={querySignUp.cidCardImg} alt="" width='150px' className='headimg'/>
                    </div>
                    <ul>
                        <li>
                            <p className='result_left'> 考生姓名：</p>
                            <p className='result_right'>{querySignUp.cname}</p>
                        </li>
                        <li>
                            <p className='result_left'> 性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：</p>
                            <p className='result_right'>{querySignUp.params.sex}</p>
                        </li>
                        <li>
                            <p className='result_left'> 身份证号：</p>
                            <p className='result_right'>{querySignUp.cidCard}</p>
                        </li>
                        <li>
                            <p className='result_left'> 考试场地：</p>
                            <p className='result_right'>{querySignUp.params.address}</p>
                        </li>
                        <li>
                            <p className='result_left'> 民&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;族：</p>
                            <p className='result_right'>{querySignUp.params.nation}</p>
                        </li>
                        <li>
                            <p className='result_left'> 考生类型：</p>
                            <p className='result_right'>{querySignUp.params.examType}</p>
                        </li>
                         <li>
                            <p className='result_left'> 报考状态：</p>
                            <p className='result_right'>{querySignUp.params.statusName}</p>
                        </li>
                        <li>
                            <p className='result_left'> 考试费用：</p>
                            <p className='result_right'>{querySignUp.params.payAmt}</p>
                        </li>
                        {/* <li>
                            <p className='result_left'> 报考等级：</p>
                            <p className='result_right'>{querySignUp.params.examGrade}</p>
                        </li> */}
                        <li>
                            <p className='result_left'> 缴费状态：</p>
                            <p className='result_right'>{querySignUp.params.payStatusName}</p>
                        </li>
                        <li>
                            <p className='result_left'> 职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;业：</p>
                            <p className='result_right'>{querySignUp.coccupation}</p>
                        </li>
                        <li>
                            <p className='result_left'> 考试时间：</p>
                            <p className='result_right'>{querySignUp.tsignUpTime}</p>
                        </li>
                        <li>
                            <p className='result_left'> 工作单位：</p>
                            <p className='result_right'>{querySignUp.cworkUnit}</p>
                        </li>
                        {/* <li>
                            <p className='result_left'> 资料费用：</p>
                            <p className='result_right'>{querySignUp.ndataPrice}</p>
                        </li> */}
                        <li>
                            <p className='result_left'> 分&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;数：</p>
                            <p className='result_right'>{querySignUp.nfraction}</p>
                        </li>
                         <li>
                            <p className='result_left'> 分数等级：</p>
                            <p className='result_right'>{querySignUp.cfractionGrade}</p>
                        </li>
                        <li>
                            <p className='result_left'> 退回原因：</p>
                            <p className='result_right'>{querySignUp.creject}</p>
                        </li>
                    </ul>
                    <Button type="primary" htmlType="submit" className='btnsure' onClick={this.surebtn}>
                        确认
                        </Button>
                </div>
                }
                
                
            </Card>
        </div>)
    }
 
}
export default Form.create()(MyRegister);