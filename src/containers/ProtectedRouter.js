import React,{Component} from 'react'
import {  withRouter } from 'react-router-dom'
// withRouter是一个高级组件，使用它之后，可以多出来3个属性：history , match ,location。路由组件中无须使用它包裹组件；只有非路由组件，跳转的时候才需要使用它
 class ProtectedRouter extends Component{
    componentWillMount (){
        console.log('===========ProtectedRouter')
        console.log(this.props)
        let flag=false
        if(flag){
            this.props.history.push('/')
        }
    }
    render(){
        let {path,component:Component}=this.props
        return (
            <div>
                <Component></Component>
            </div>
        )
    }
}
export default withRouter(ProtectedRouter)
