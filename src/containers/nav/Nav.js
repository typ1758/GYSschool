import React,{Component} from 'react'
import { Link , withRouter ,NavLink } from 'react-router-dom'
import './Nav.css'

export default class Nav extends Component{
    componentWillMount (){
        console.log(this.props)
    }
    navlink = (i) => {
        console.log(i)
    }
    render(){
        return (
            <div className='headerbox'>
                <div>
                    <img src={require("./../../images/logo.png")} alt=""/>
                </div>
                <div className='nacbox'>
                    <ul className="nav nav-tabs">
                        <li role="presentation"><a href='http://www.cqipc.edu.cn/'>学院首页</a></li>
                        <li role="presentation" onClick={this.navlink(1)}><NavLink to={'/index'}>立即报考</NavLink></li>
                        <li role="presentation" onClick={this.navlink(1)}><NavLink to={{pathname:'/details/thequery' }}>报考查询</NavLink></li>
                        <li role="presentation" onClick={this.navlink(1)}><NavLink to={{pathname:'/details/announcement' }}>考试公告</NavLink></li>
                    </ul>
                    {/* <button onClick={()=>{ console.log(this.props); this.props.history.push('/profile') }}>测试按钮</button> */}
                </div>
            </div>
        )
    }
}
// export default  withRouter(Nav)
