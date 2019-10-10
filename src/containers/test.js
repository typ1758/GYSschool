
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

 import { Button, WhiteSpace, WingBlank } from 'antd-mobile';
 
    class Test extends Component {
    constructor (props) {
        super(props)
    }
 
   render() {
       return (
           <div id="test-container">
                <Button>default</Button><WhiteSpace />
                <Button disabled>default disabled</Button><WhiteSpace />
               {/* <p>search:{this.props.location.search} </p> */}
               {/* <p>state:{this.props.location.state.mold} </p> */}
               <div onClick={() =>  this.props.history.goBack()}>返回上一页</div>
               <div onClick={() => this.props.history.push('/message/12')}>message页面</div>
           </div>
       );
   }
}
export default Test;