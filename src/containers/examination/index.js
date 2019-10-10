import React from "react";
import Position from './Position.js';
import './index.css'
import axios from 'axios';
import Cropper from 'react-cropper';
import qs from 'qs';
import * as QrCode from 'qrcode.react'
import config from './../../store/config'
import {
    Form,
    Input,
    Tooltip,
    Icon,
    Modal,
    Cascader,
    Select,
    Row,
    Col,
    Checkbox,
    Button,
    Card,
    Radio,
    AutoComplete,
    Upload, 
    message,
    notification 
} from 'antd';
const {
    Option
} = Select;
const {
    confirm
} = Modal;
const {
    Search
} = Input;
const {
    TextArea
} = Input;
const AutoCompleteOption = AutoComplete.Option;
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  
  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('您只能上传JPG/PNG文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图像必须小于2MB!');
    }
    return isJpgOrPng && isLt2M;
  }
 
class MyRegister extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state = {
            figurevisible: false,
            upidcodeImg:'',
            croppervis: false,
            visiblepay:false,
            visible: false,
            btnpayloading:false,
            loading: false,
            btnloading:false,
            confirmDirty: false,
            autoCompleteResult: [],
            getArea:[],
            thecity:[],
            area:[],
            x_getArea:[],
            x_thecity:[],
            x_area:[],
            ordernum:'',
            subjects:'',
            amountof:'',
            sinnationlistArry:[], //  民族
            signgradelistArry:[], //考试级别
            examtypelistArry:[], //考生类型
            sysusersexArry:[], // 性别
            detaildata:'',
            cIdCardImg:'', // 身份证照片
            Noregistration: false // 判断是否有报考信息
        };
    }
    componentDidMount(){
        this.getArea()
        this.signnation('sign_nation')
        this.signnation('sign_grade')
        this.signnation('exam_type')
        this.signnation('sys_user_sex')
        this.detail()
        this.props.form.setFieldsValue({
            category: '3_社会人士',
            professional: '社会人士',
        })
        
    }
     handleSubmita = e => {
         e.preventDefault();
         this.props.form.validateFields((err, values) => {
             if (!err) {
                 console.log('Received values of form: ', values);
             }
         });
     };
    handleSubmit = e => {
        console.log(e)
        e.preventDefault();
        const {imageUrl} = this.state
        // if(imageUrl===undefined){
        //     message.warning('请上传身份证正面照！');
        //     return
        // }
        this.props.form.validateFields((err, values) => {
            console.log(err)
            if (!err) {
                this.setState({
                    btnloading:true
                })
                console.log('Received values of form: ', values);
                let _this=this
                let data={
                    cAddress:values.address,// 地址
                    cBirthArea:values.cBirthArea,// 出生区县
                    cBirthCity:values.thecityValue,// 出生城市
                    cBirthProvince:values.province,// 出生省份
                    cBranchName :'',// 部门名称
                    // cExamGrade: values.level, // 报考等级
                    cExamType:values.category.split('_')[0],// 考试类型
                    cIdCard:values.idcard,// 身份证号
                    cIdCardImg :this.state.cIdCardImg,// 证件图片
                    cName:values.nickname,// 姓名
                    cNationNo:values.national.split('_')[0],// 民族编号
                    cNowArea:values.x_cNowArea,// 现在居住区县
                    cNowCity:values.x_thecityValue,// 现在居住城市
                    cNowProvince:values.x_province,// 现在居住省份
                    cOccupation:values.professional,// 职业
                    cPhone:values.phone,// 手机号
                    cSex:values.sexgroup.split('_')[0],//性别
                    cSchoolName: values.departments, // 学校名称
                    cStudentNo:'',//学号
                    cWorkUnit: values.cWorkUnit, //工作单位*
                    nBirthMonth:'',//出生月份
                    nBirthYear:'',//出生年份
                    nCertificatePrice: values.certificatefees, //证书费
                    nDataPrice: values.Informationcosts, //资料费
                    nExamId:_this.state.detaildata.nexamId,//考试计划编号 *
                    nOtherPrice: values.Otherfees, //其他费
                    nPayPrice:'',//缴费金额
                    nSignId:'',//报名编号
                    nStuffPrice: values.materialcost, //材料费
                    nZipCode:'',//邮编
                    signUpEntity:'',//新增报名信息
                }
                    axios.post(config.host + '/api/school/sign/save', qs.stringify(data))
                    .then(function (response) {
                        let data=response.data.data
                        _this.setState({
                            btnloading: false
                        })
                        if (response.data.code===0){
                            if (data.ctradeDes ==='已缴费'){
                                notification['success']({
                                    message: '系统消息',
                                    description:
                                        '您已完成缴费，请您及时参加考试！',
                                });
                                return
                            }
                            _this.setState({
                                ordernum: data.ctradeNo,
                                subjects: data.ctradeDes,
                                amountof: data.npayAmt,
                                visible: true,
                            })
                        }else{
                            Modal.error({
                                title: '系统消息',
                                content: response.data.msg,
                                okText: '知道了'
                            });
                        }

                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        });
    };
    getAreaChange = (e) => {
        this.thecity(e,'province')
        this.props.form.setFieldsValue({
            thecityValue: '',
            cBirthArea:''
        });
    }
    thecityChange = (e) => {
        this.thecity(e,'city')
        this.props.form.setFieldsValue({
             cBirthArea: ''
        });
       
    }
    x_getAreaChange = (e) => {
        this.thecity(e,'x_province')
        this.props.form.setFieldsValue({
            x_thecityValue: '',
            x_cNowArea:''
        });
        
    }
    x_thecityChange = (e) => {
        this.thecity(e,'x_city')
        this.props.form.setFieldsValue({
            x_cNowArea: ''
        });
    }
    signnation = (type)=>{
        let _this=this
        axios.get(config.host + '/api/system/dict/getType?dictType=' + type)
        .then(function (response) {
            let dataList=response.data.data;
            let  sinnationlist=[]
            let  signgradelist=[]
            let  examtypelist=[]
            let  sysusersex=[]
            
            if(type==='sign_nation'){
                dataList.map((v,i)=>{
                    sinnationlist.push({dictCode:v.dictValue,dictLabel:v.dictLabel})
                })
                _this.setState({
                    sinnationlistArry:sinnationlist,
                })
            }else if(type==='sign_grade'){
                dataList.map((v,i)=>{
                    signgradelist.push({dictCode:v.dictValue,dictLabel:v.dictLabel})
                })
                _this.setState({
                    signgradelistArry:signgradelist
                })
            }else if(type==='exam_type'){
                dataList.map((v,i)=>{
                    examtypelist.push({dictCode:v.dictValue,dictLabel:v.dictLabel})
                })
                console.log(examtypelist)
                _this.setState({
                    examtypelistArry:examtypelist
                })
            }else if(type==='sys_user_sex'){
                dataList.map((v,i)=>{
                    sysusersex.push({dictCode:v.dictValue,dictLabel:v.dictLabel})
                })
                _this.setState({
                    sysusersexArry:sysusersex
                })
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    thecity = (e,city) =>{
        let _this=this
        axios.get(config.host + '/api/school/area/getArea?code=' + e)
        .then(function (response) {
            let getArealist=[]
            let dataList=response.data.data;
            dataList.map((v,i)=>{
                getArealist.push({areaCode:v.areaCode,areaName:v.areaName})
            })
            if(city==='province'){
                _this.setState({
                    thecity:getArealist
                })
            }else if(city==='city'){
                _this.setState({
                    area:getArealist
                })
            }else if(city==='x_province'){
                _this.setState({
                    x_thecity:getArealist
                })
            }else if(city==='x_city'){
                _this.setState({
                    x_area:getArealist
                })
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    getArea = () => {
        let _this=this
        axios.get(config.host + '/api/school/area/getArea?code=0')
        .then(function (response) {
            let getArealist=[]
            let dataList=response.data.data;
            
            dataList.map((v,i)=>{
                getArealist.push({areaCode:v.areaCode,areaName:v.areaName})
            })
            _this.setState({
                getArea:getArealist,
                x_getArea:getArealist
            })
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    detail = () => {
        // 获取当前可报考的考试计划
        let _this=this
        axios.get(config.host + '/api/school/exam/detail')
        .then(function (response) {
            if (response.data.code===500){
                Modal.error({
                    title: '系统消息',
                    content: response.data.msg,
                    okText: '知道了'
                });
                _this.setState({
                    Noregistration:true
                })
                return
            }
            _this.setState({
                detaildata:response.data.data,
            })
            _this.props.form.setFieldsValue({
                sexgroup: '2_未知',
                testcost:response.data.data.nsocialWorkersPrice,
                certificatefees:'0.0',
                Informationcosts:'0.0',
                materialcost:'0.0',
                Otherfees:'0.0'
            })
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    handleSelectedPosition = (value) => {
        this.setState({
          province: value[0],
          city: value[1],
          county: value[2],
        });
      }
    categoryChange =(e) =>{
        console.log(e)
    }
    idcardvalidation= (rule, value, callback) => {
        var reg = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/;
        
        if (value&&!(reg.test(value))){
            callback('请输入正确的身份证号码'); // 校验未通过
        }else{
            console.log(value)
        }
        callback(); // 校验通过
    }
    phonevalidation = (rule, value, callback) => {
        if (value&&!(/^1[3456789]\d{9}$/.test(value))){
            callback('请输入正确的手机号'); // 校验未通过
        }
    
        callback(); // 校验通过
    
    }
    textAreavalidation = (rule, value, callback) => {
        console.log(value)
        if (value && value.length > 30) {
            callback('字数要求不超过30字符'); // 校验未通过
        }
        callback(); // 校验通过
    }
    handleChange = info => {
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.y
          getBase64(info.file.originFileObj, imageUrl =>
            this.setState({
                cIdCardImg:info.file.response.fileName,
               imageUrl,
              loading: false,
            }),
           
          );
        }
      };
      alyhandleOk = e =>{
          let _this=this
            axios.get(config.host + '/api/school/order/queryOrder?cTradeNo=' + this.state.ordernum)
            .then(function (response) {
                let data = response.data.data
                if (data.status === 1){
                    confirm({
                        title: '您尚未完成支付交易是否取消?',
                        cancelText: '取消',
                        okText: '确认',
                        onOk() {
                              _this.setState({
                                  visiblepay: false,
                              })
                        },
                        onCancel() {
                            console.log('Cancel');
                        },
                    });
                } else if (data.status === 2) {
                    message.success('报名成功，请及时参加考试！');
                    _this.setState({
                        visiblepay: false,
                    })
                } else if (data.status === 3) {
                    message.error('报名失败！');
                    _this.setState({
                        visiblepay: false,
                    })
                }
            // _this.setState({
            //     btnpayloading: true,
            // });
        })
        .catch(function (error) {
            console.log(error);
        });
      }
      alyhandleCancel = () =>{
          this.setState({
              visiblepay: false,
          });
      }
      handleOk = e => {
        let _this=this
        this.setState({
            btnpayloading: true,
        });
        let data={
            cDataSrc:'PC',
            cTradeNo:this.state.ordernum,
            nExamId:this.state.detaildata.nexamId,
            nPayAmt:this.state.amountof,
        }
        axios.post(config.host + '/api/school/order/createOrder', qs.stringify(data))
            .then(function (response) {
                _this.setState({ 
                    btnpayloading: false, 
                    visible: false,
                    payurl: response.data.data.cpayUrl,
                    visiblepay:true
                });
                console.log(JSON.stringify(response.data.data.params))
                let params = JSON.stringify(response.data.data.params)
                localStorage.setItem('params', params)
                // _this.props.history.push('/payto/' + JSON.stringify(response.data.data.params))
                _this.props.history.push('/details/thequery')
                const w = window.open('about:blank');
                w.location.href = 'http://183.230.255.84:9292/pthpc/#/payto'
            })
            .catch(function (error) {
                console.log(error);
            });
      };
    
      handleCancel = e => {
        this.setState({
            figurevisible:false,
          visible: false,
          croppervis: false,
        });
      };
      handleCancelpay = e => {
          let _this = this
          confirm({
              title: '您尚未完成支付交易是否取消?',
              cancelText: '取消',
              okText: '确认',
              onOk() {
                  _this.setState({
                      visiblepay: false,
                  })
              },
              onCancel() {
                  console.log('Cancel');
              },
          });
      };
      onChangeRadio = e => {
          this.setState({
              value: e.target.value,
          });
      };
       //点击保存的函数，需要在这里进行压缩
       saveImg =() => {
            const _this = this;
            let file = this.refs.cropper.getCroppedCanvas().toDataURL()
            let formData = new FormData()
            formData.append('avatar', this.dataURLtoBlob(file))
            confirm({
                title: '温馨提示',
                content: '请上传390*567像素的免冠证件照，以免报考失败！',
                cancelText: '取消',
                okText: '确定',
                onOk() {
                    console.log('OK');
                    axios.post(config.host + '/api/school/common/upload', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                        .then(function (response) {
                            if (response.data.code === 0) {
                                message.success('上传成功');
                                _this.setState({
                                    upidcodeImg: file,
                                    imageUrl: response.data.fileName,
                                    croppervis: false,
                                    cIdCardImg: response.data.fileName,
                                })
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });

                },
                onCancel() {
                    console.log('Cancel');
                },
            });
       }
        _crop = () => {
            // image in dataUrl
            this.setState({
                coytoDataURL: this.refs.cropper.getCroppedCanvas().toDataURL()
            })
        }
        // 将base64文件转乘文件流
        dataURLtoBlob(baseurl) {
            let arr = baseurl.split(',')
            let mime = arr[0].match(/:(.*?);/)[1]
            let bstr = atob(arr[1])
            let n = bstr.length
            let u8arr = new Uint8Array(n)
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
            return new Blob([u8arr], {
                type: mime
            })
        }
        onclickfigure = () =>{
            this.setState({
                figurevisible:true
            })
        }
        idcardonchange = (e) =>{
            console.log(e)
        }
        onChangefile = (e) => {
            e.preventDefault();
            let _this = this
            let files;
            if (e.dataTransfer) {
                files = e.dataTransfer.files;
            } else if (e.target) {
                files = e.target.files;
            }
            if (files.length > 0) {
                // 验证 files[0] 信息的文件大小
                const fileMaxSize = 1024;
                let fileSize = files[0].size / 1024;
                if (fileSize > fileMaxSize) {
                    alert("文件不能大于1M！");
                    return false;
                } else if (fileSize <= 0) {
                    alert("文件不能为0");
                    return false;
                }
                getBase64(e.target.files[0], imageUrl => {
                    _this.setState({
                        croppervis: true,
                        imageUrlcoy: imageUrl
                    })
                });

                // 验证 files 信息的文件类型
                // const fileType = file.type;
                // if (!FILE_TYPES.includes(fileType)) {
                //     alert("不接受此文件类型");
                //     return false;
                // }

                const reader = new FileReader();
                reader.onload = () => {
                    this.setState({
                        src: reader.result
                    })
                }
                // reader.readAsDataURL(files);

            } else {
                if (this.state.src === null) {
                    alert("请选择文件");
                }
                return false;
            }
            
           
        }
        professionalChange = (e) => {
            console.log(e)
        }
        querySignUpByCardId = (e) =>{
            let _this = this
            let data = {
                cIdCard:e,
                nExamId: this.state.detaildata.nexamId
            }
            message.info('查询中......');
            axios.post(config.host + '/api/school/sign/querySignUpByCardId', qs.stringify(data))
                .then(function (res) {
                    let data=res.data
                    if (data.code === 500) {
                         Modal.error({
                             title: '系统消息',
                             content: data.msg,
                             okText: '知道了'
                         });
                    }else{
                        confirm({
                            title: '系统消息',
                            content: '您已有该考试计划的报名信息，是否覆盖已有信息！',
                            okText: '确认',
                            cancelText: '取消',
                            onOk() {
                                _this.setState({
                                    upidcodeImg : data.data.cidCardImg,
                                    imageUrl: data.data.cidCardImg,
                                    cIdCardImg: data.data.cidCardImg
                                })
                                _this.thecity(data.data.cbirthProvince, 'province')
                                _this.thecity(data.data.cbirthCity, 'city')
                                _this.thecity(data.data.cnowProvince, 'x_province')
                                _this.thecity(data.data.cnowCity, 'x_city')
                                let csexvalue=''
                                switch(data.data.csex){
                                    case '0':
                                        csexvalue = '_男'
                                        break;
                                    case '1':
                                        csexvalue = '_女'
                                        break;
                                    case '2':
                                        csexvalue = '_未知'
                                        break;    
                                }
                                _this.props.form.setFieldsValue({
                                    nickname: data.data.cname,
                                    phone: data.data.cphone,
                                    professional: data.data.coccupation,
                                    sexgroup: data.data.csex+csexvalue,
                                    address: data.data.caddress,
                                    departments: data.data.cschoolName,
                                    // level: data.data.cexamGrade,
                                    province: data.data.cbirthProvince,
                                    x_province: data.data.cnowProvince,
                                    thecityValue: data.data.cbirthCity,
                                    cBirthArea: data.data.cbirthArea,
                                    national: data.data.cnationNo,
                                    x_thecityValue: data.data.cnowCity,
                                    x_cNowArea: data.data.cnowArea,
                                    certificatefees: data.data.ncertificatePrice,
                                    Informationcosts: data.data.ndataPrice,
                                    materialcost: data.data.nstuffPrice,
                                    Otherfees: data.data.notherPrice,
                                    cWorkUnit: data.data.cworkUnit,
                                })
                            },
                        });
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    render(){
            const { getFieldDecorator } = this.props.form;
            const { 
                autoCompleteResult,
                sinnationlistArry, 
                signgradelistArry,
                examtypelistArry,
                imageUrl, 
                sysusersexArry,
                detaildata,
                subjects,
                amountof,
                ordernum,
                croppervis,
                imageUrlcoy,
                coytoDataURL,
                upidcodeImg
            } = this.state;
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
            const uploadButton = (
                <div>
                  <Icon type={this.state.loading ? 'loading' : 'plus'} />
                  <div className="ant-upload-text">上传身份证</div>
                </div>
              );
        return(
        <div>
            <Card>
             <Modal
                title = "查看示例图"
                visible = {
                    this.state.figurevisible
                }
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                        <Button onClick={this.handleCancel} loading={this.props.loading}>知道了</Button>
                    ]}
                >
                <div className='shileb'>
                    <img src={require('./timg.jpg')} width='300' />
                </div>
                </Modal>
            <div className='idcode'>
                <div className='idcodeicon'>
                    {
                        upidcodeImg !=='' ?<div>
                            <img className='upidcodeImg' src={upidcodeImg} />
                        </div>:<div>
                            <Icon type="plus" />
                            <p>小二寸<br/>蓝底照片</p>
                            <p className='shilie' onClick={this.onclickfigure}>查看示例图</p>
                        </div>
                    }
                    
                </div>
                <div className='idcodeupdate'>
                    <input type="file" title="" accept="image/*" onClick={(event)=>  { event.target.value = null }}  onChange={this.onChangefile} />
                </div>
            </div>
                <div>
                    {/* 弹窗裁剪图片*/}
                    <Modal
                    closable= {false}
                    key="cropper_img_modal_key"
                    visible = {
                        croppervis
                    }
                    loading={this.props.loading}
                    footer={[
                        <Button type="primary" onClick={this.saveImg} loading={this.props.loading}>确认上传</Button>,
                        <Button onClick={this.handleCancel} loading={this.props.loading}>取消</Button>
                    ]}>
                        <Cropper
                        ref='cropper'
                        src = {
                            imageUrlcoy
                        }
                        style={{height: 300, width: '100%'}}
                        // Cropper.js options
                        aspectRatio={12 / 16}
                        guides={false}
                        crop={this._crop} />
                        <div className='coytoDatbox'>
                                <img src={coytoDataURL} />
                        </div>
                        
                    </Modal>
                </div>

                <Modal
                    visible={this.state.visiblepay}
                    title = "您的订单已经提交成功,请完成支付！"
                    onOk={this.handleOkpay}
                    onCancel={this.handleCancelpay}
                    footer={[
                        <Button key="submit" type="primary"  onClick={this.alyhandleOk}>
                        查询支付状态
                        </Button>,
                    ]}
                    >
                        <div className='palyimg'>
                            {/* <div className='palbox'>
                                <img src={require('./paly1.png')} />
                                <div className='QrCodebox'>
                                        <p className='textd'>扫码付款</p>
                                        <div className='palcode'>
                                            <QrCode value={this.state.payurl} size={200} />
                                        </div>
                                        <p class='ordtextnum'>金额：<span>{amountof}</span>元</p>
                                </div>
                            </div> */}
                            <p className='ordtext'>收费原因：<span>{subjects}</span></p>
                            <p className='ordtext'>订单编号：<span>{ordernum}</span></p>
                        </div>
                   
                    </Modal>
            <Modal
                title="系统消息"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" onClick={this.handleCancel}>
                      取消
                    </Button>,
                    <Button key="submit" type="primary" loading={this.state.btnpayloading} onClick={this.handleOk}>
                      <img src={require('./treasure.png')} width={25} style={{marginRight:'10px',textAlign:'center'}}/>立即支付
                    </Button>,
                  ]}
                >
                    <div className='paymadile'>
                        <p>订单号:{ordernum}</p>
                        <p>考试科目：{subjects}</p>
                        <p>交易金额：{amountof}元</p>
                    </div>
                </Modal>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
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
                    })( <Search
                        placeholder="请输入身份证号"
                        onSearch = {
                            value => this.querySignUpByCardId(value)
                        }
                        />)}
                    </Form.Item>
                    <Form.Item
                        label={
                            <span> 考生类别</span>
                        }
                    >
                    {
                        getFieldDecorator('category', {
                            rules: [{
                                required: true,
                                message: ' 请选择考生类别!',
                                whitespace: true
                            }],
                        })(  <Select
                        style={{ width: '100%' }}
                        onChange={this.categoryChange}
                        >
                            {
                                examtypelistArry.map((v,i)=>(
                                    <Option disabled   key={i} value={v.dictCode+'_'+v.dictLabel} >{v.dictLabel}</Option>
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
                     <Form.Item label="性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别">
                        {getFieldDecorator('sexgroup')(
                            <Radio.Group onChange={this.onChangeRadio} value='2_未知'>
                                {
                                    sysusersexArry.map((v,i)=>(
                                        <Radio key={i} value={v.dictCode+'_'+v.dictLabel}>{v.dictLabel}</Radio>
                                    ))
                                }
                            </Radio.Group>
                        )}
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
                    <Form.Item
                        label={
                            <span>职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;业</span>
                        }
                    >
                    {
                        getFieldDecorator('professional', {
                            rules: [{
                                required: true,
                                message: ' 请选择职业!',
                                whitespace: true
                            }],
                        })(  <Select
                        style={{ width: '100%' }}
                        onChange={this.professionalChange}
                        >
                        {
                            examtypelistArry.map((v,i)=>(
                                <Option disabled   key={i} value={v.dictLabel} >{v.dictLabel}</Option>
                            ))
                        }
                    </Select> )
                    }
                    </Form.Item>
                    <Form.Item
                        label={
                            <span>民&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;族</span>
                        }
                    >
                    {
                        getFieldDecorator('national', {
                            rules: [{
                                required: true,
                                message: ' 请选择民族!',
                                whitespace: true
                            }],
                        })(  <Select
                        style={{ width: '100%' }}
                        onChange={this.nationalChange}
                        >
                            {
                                sinnationlistArry.map((v,i)=>(
                                    <Option key={i} value={v.dictCode}>{v.dictLabel}</Option>
                                ))
                            }
                    </Select> )
                    }
                  
                    </Form.Item>
                    <Form.Item
                        label={
                            <span> 工作单位</span>
                        }
                    >
                    {/* {
                        getFieldDecorator('phone', {
                            rules: [{
                                required: true,
                                message: ' 请输入电话号码!',
                                whitespace: true
                            }, {
                                validator: this.phonevalidation
                            }],
                        })( <TextArea 
                        placeholder = "请输入工作单位(要求不超过30)"
                        autosize={{ minRows: 2, maxRows: 6 }} 
                    /> )
                    } */}
                    { getFieldDecorator('cWorkUnit', {
                        rules: [{
                            required: true,
                            message: ' 请输入工作单位!',
                            whitespace: true
                        }, {
                            validator: this.textAreavalidation
                        }],
                    })(<TextArea 
                        placeholder = "请输入工作单位(要求不超过30)"
                        autosize={{ minRows: 2, maxRows: 6 }} 
                    />)}
                    </Form.Item>
                    <Form.Item
                        label={
                            <span>出生地区</span>
                        }
                    >
                    {
                        getFieldDecorator('province')(  <Select
                        style={{ width: '33.333%',paddingRight:'30px' }}
                        onChange={this.getAreaChange}
                        >
                            {
                                this.state.getArea.map((v,i)=>(
                                    <Option key={i} value={v.areaCode}>{v.areaName}</Option>
                                ))
                            }
                        
                    </Select> )
                    }
                    {
                        getFieldDecorator('thecityValue')(  <Select
                        style={{ width: '33.333%',paddingRight:'30px' }}
                        onChange={this.thecityChange}
                        >
                            {
                                this.state.thecity.map((v,i)=>(
                                    <Option key={i} value={v.areaCode}>{v.areaName}</Option>
                                ))
                            }
                        
                    </Select> )
                    }
                    {
                        getFieldDecorator('cBirthArea')(  <Select
                        style={{ width: '33.333%' }}
                        >
                            {
                                this.state.area.map((v,i)=>(
                                    <Option key={i} value={v.areaCode}>{v.areaName}</Option>
                                ))
                            }
                        
                    </Select> )
                    }
                  
                    </Form.Item>
                    <Form.Item
                        label={
                            <span>现居住地</span>
                        }
                    >
                   {
                        getFieldDecorator('x_province')(  <Select
                        style={{ width: '33.333%',paddingRight:'30px' }}
                        onChange={this.x_getAreaChange}
                        >
                            {
                                this.state.x_getArea.map((v,i)=>(
                                    <Option key={i} value={v.areaCode}>{v.areaName}</Option>
                                ))
                            }
                        
                    </Select> )
                    }
                    {
                        getFieldDecorator('x_thecityValue')(  <Select
                        style={{ width: '33.333%',paddingRight:'30px' }}
                        onChange={this.x_thecityChange}
                        >
                            {
                                this.state.x_thecity.map((v,i)=>(
                                    <Option key={i} value={v.areaCode}>{v.areaName}</Option>
                                ))
                            }
                        
                    </Select> )
                    }
                    {
                        getFieldDecorator('x_cNowArea')(  <Select
                        style={{ width: '33.333%' }}
                        >
                            {
                                this.state.x_area.map((v,i)=>(
                                    <Option key={i} value={v.areaCode}>{v.areaName}</Option>
                                ))
                            }
                        
                    </Select> )
                    }
                    </Form.Item>
                    <Form.Item
                        label={
                            <span> 地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址</span>
                        }
                    >
                    { getFieldDecorator('address')(<Input />)}
                    </Form.Item>
                    <Form.Item
                        label={
                            <span>所在院系</span>
                        }
                    >
                    { getFieldDecorator('departments')(<Input />)}
                    </Form.Item>
                    {/* <Form.Item
                        label={
                            <span>报考级别</span>
                        }
                    >
                    {
                        getFieldDecorator('level')(  <Select
                        style={{ width: '100%' }}
                        onChange={this.levelChange}
                        >
                            {
                                signgradelistArry.map((v,i)=>(
                                    <Option key={i} value={v.dictCode}>{v.dictLabel}</Option>
                                ))
                            }
                    </Select> )
                    }
                    </Form.Item> */}
                    <Form.Item
                        label={
                            <span>考试场地</span>
                        }
                    >
                        { getFieldDecorator('site',{
                        initialValue:detaildata.cexamAddress,
                    })(<Input disabled/>)}
                    </Form.Item>
                    {/* <Form.Item
                        label={
                            <span> 考试时间</span>
                        }
                    >
                    { getFieldDecorator('testtime',{
                        initialValue:detaildata.texamBeginTime
                    })(<Input disabled/>)}
                    </Form.Item> */}
                    <Form.Item
                        label={
                            <span> 证书费用</span>
                        }
                    >
                    { getFieldDecorator('certificatefees')(<Input />)}
                    </Form.Item>
                    <Form.Item
                        label={
                            <span>   资料费用</span>
                        }
                    >
                    { getFieldDecorator('Informationcosts')(<Input />)}
                    </Form.Item>
                    <Form.Item
                        label={
                            <span>  材料费用</span>
                        }
                    >
                    { getFieldDecorator('materialcost')(<Input />)}
                    </Form.Item>
                    <Form.Item
                        label={
                            <span>   其他费用</span>
                        }
                    >
                    { getFieldDecorator('Otherfees')(<Input />)}
                    </Form.Item>
                    <Form.Item
                        label={
                            <span>   考试费用</span>
                        }
                    >
                    { getFieldDecorator('testcost')(<Input disabled/>)}
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" loading={this.state.btnloading} disabled = {this.state.Noregistration}>
                            提交并支付
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>)
    }
 
}
export default Form.create()(MyRegister);