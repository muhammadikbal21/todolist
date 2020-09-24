import React, {Component} from 'react';
import './Register.scss';
import Button from '../../../components/atoms/Button';
import { connect } from 'react-redux';
import { registerUserAPI } from '../../../config/redux/dispatch';

class Register extends Component{
    state = {
        email: '',
        password: '',
    }

    handleChangeText = (e) => {
        // console.log(e.target);
        this.setState({
            [e.target.id]: e.target.value
            //mengubah nilai secara spesifik, ketika akan mengubah email maka yang diubah hanya email begitu juga dengan password
        })
    }

    handleRegisterSubmit = async () => { //proses menunggu hasil Promise dari API
        // console.log('email : ', this.state.email)
        // console.log('password : ', this.state.password)
        const {email, password} = this.state; 
        console.log('data before send : ', email, password); //mengconsole nilai input dari email dan password
        const res = await this.props.registerAPI({email, password}).catch(err => err); //catch yaitu untuk menangkap jika terjadi error
        if(res === true){ //karena nilai resolve nya true maka nilai state akan diubah menjadi kosong
            this.setState({
                email: '',
                password: ''
            })
        }
        
        // this.setState({
        //     isLoading: true
        // })
        // setTimeout(()=> {
        //     this.setState({
        //         isLoading: false
        //     })
        // }, 5000)
    }

    render(){
        return(
            <div className="auth-container">
                <div className="auth-card">
                    <p className="auth-title">Register Page</p>
                    <input className="input" id="email" placeholder="Email" type="text" onChange={this.handleChangeText} value={this.state.email} />
                    <input className="input" id="password" placeholder="Password" type="password" onChange={this.handleChangeText} value={this.state.password} />
                    {/*value sebagai nilai pada form diatas, disini nilainya menggunakan this.state.email dan this.state.password agar apa yang akan diinput pada form itu akan menjadi nilai pada form tersebut*/}
                    {/* <button className="btn" onClick={this.handleRegisterSubmit}>Register</button> */}
                    <Button onClick={this.handleRegisterSubmit} title='Register' loading={this.props.isLoading} />
                </div>                
                {/* <button>Go to Login</button> */}
            </div>
        )
    }
}

const reduxState = (state) => ({
    isLoading: state.isLoading
})

const reduxDispatch = (dispatch) => ({
    registerAPI: (data) => dispatch(registerUserAPI(data))
})

export default connect(reduxState, reduxDispatch) (Register);