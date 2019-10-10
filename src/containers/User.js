import React, {Component} from 'react'
import { Link, Route ,NavLink} from 'react-router-dom'
import Add from '../containers/Add'
import List from '../containers/List'

export default class User extends Component {
    render() {
        return (
            <div className={'container'}>
                <div className="row">
                    <div className="col-md-3">
                        <ul className="nav nav-staked">
                            <li role="presentation"><NavLink to={'/user/add'}>添加用户</NavLink></li>
                            <li role="presentation"><NavLink to={'/user/list'}>用户列表</NavLink></li>
                        </ul>
                    </div>
                    <div className="col-md-9">
                        {/*<Route path={'/user'} exact={true} component={Add}></Route>*/}
                        <Route path={'/user/add'} component={Add}></Route>
                        <Route path={'/user/list'} component={List}></Route>
                    </div>
                </div>
            </div>
        )
    }
}
