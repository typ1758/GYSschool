import React, {Component} from 'react';
//路由的2种形式： hash(HashRouter) , H5的historyApi(BroswerRouter)是路由的容器，是组件，要包在路由的外面
import { Route, Switch, Redirect } from 'react-router-dom'
// import {Home} from './containers/Home',写法错误，错误原因如下解释
import Home from '../containers/Home'
import examination from '../containers/examination'
import Profile from '../containers/Profile'
import Thequery from '../containers/thequery'
import Test from '../containers/test'
import details from '../containers/details'
import ProtectedRouter from '../containers/ProtectedRouter'
import announcement from '../containers/announcement'
import payto from '../containers/Add.js'


export default class RouterView extends Component {
    componentWillMount (){
        console.log(this.props)
    }
    render() {
        return (

                <div className={'container'}>
                    <div className="row">
                        <div className="col-md-12">
                            {/*Switch 让router匹配后就停止匹配下面的，这个时候访问下面的3个路由时，出现的都是home组件 */}
                            <Switch >
                                {/*exact确切的，表示只有路径完全相同时，才会匹配*/}
                                <Route path='/index' exact={true} component={examination}></Route>
                                <Route path={'/payto'} exact={true} component={payto}></Route>
                                <Route path={'/profile'} exact={true} component={Profile}></Route>
                                <Route path={'/details/announcement'} exact={true} component={announcement}></Route>
                                {/*<Route path={'/user'} component={User}></Route>*/}
                                <Route path="/test" component={Test} />
                                <ProtectedRouter path={'/details/thequery'} exact={true} component={Thequery}></ProtectedRouter>
                                {/*进入详情页面需要传入一个id,  details/:id   this.props.match.params={ id:1 } , ID必须要有；但是可以随机*/}
                                <Route path={'/details/:id'} component={details}></Route>
                                <Redirect to={'/'}></Redirect>
                                {/*Redirect具有重定向功能，路由变成首页路由，如果想路由不变，但是组件仍然指向home,可以这么实现*/}
                                {/*<Route  component={Home}></Route>*/}
                            </Switch>
                        </div>
                    </div>
                </div>

        );
    }
}



