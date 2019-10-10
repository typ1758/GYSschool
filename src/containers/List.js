import React, {Component} from 'react'
import { Link} from 'react-router-dom'
export default class List extends Component {
    handleClick=(index)=>{
        this.props.history.push('/profile')
    }
    render() {
        let userList = JSON.parse(localStorage.getItem('userList')) || []
        // console.log(userList)
        return (
            <div>
                <table className="table table-bordered">
                    <tbody>
                    <tr>
                        <th>用户ID</th>
                        <th>用户名称</th>
                        <th>跳转（拼接）</th>
                        <th>编辑（JSX语法）</th>
                        <th>函数调用（函数调用）</th>
                    </tr>
                    {
                        userList.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.userId}</td>
                                    <td>{item.value}</td>
                                    {/*第一种方式：拼接字符串，*/}
                                    <td> <Link to={{
                                        pathname:'/details/'+item.userId ,
                                        //刷新以后，这个状态就消失了
                                        state:index
                                    }}>编辑</Link>  </td>
                                    {/*第二种方式：JSX语法*/}
                                    <td> <Link to={`/details/${item.userId}`}>编辑</Link>  </td>
                                    {/*React里的事件参数传递和传统的JS参数有些不一样，需要通过bind方法来绑定参数，第一个参数指向this,第二个参数开始才是事件函数接收到的参数;*/}
                                    <td ><span onClick={this.handleClick.bind(this,index)}>编辑</span>  </td>
                                </tr>
                                )

                        })
                    }
                    </tbody>


                </table>
            </div>
        )
    }
}
