import React, {Component} from 'react';
import { connect } from 'react-redux';
import Button from '../../../components/atoms/Button';
import { loginUserAPI } from '../../../config/redux/dispatch';

class Login extends Component{
    state = {
        email: '',
        password: '',
    }

    handleChangeText = (e) => {
        // console.log(e.target);
        this.setState({
            [e.target.id]: e.target.value
            //mengubah nilai otomatis, ketika akan mengubah email maka yang diubah hanya email begitu juga dengan password
        })
    }

    handleLoginSubmit = async () => { //proses menunggu hasil Promise dari API
        // console.log('email : ', this.state.email)
        // console.log('password : ', this.state.password)
        const {email, password} = this.state;
        console.log('data before send : ', email, password);
        const {history} = this.props; //ini adalah coding bawaan dari react router
        const res = await this.props.loginAPI({email, password}).catch(err => err);
        if (res){
            console.log('login success', res); //karena resolve nya bernilai dataUser maka akan ditampilkan object dari dataUser pada dispatch.js
            localStorage.setItem('userData', JSON.stringify(res)); //untuk menyimpan data res dengan parameter userData kemudian akan dipanggil di Dashboard
            //dengan menjadikan object res menjadi string pada console dashboard
            //ini berguna untuk menyimpan ke localStorage ketika hendak merefresh halaman maka kita kita akan login kembali
            this.setState({ //membersihkan form ketika sudah terlogin
                email: '',
                password: ''
            })
            history.push('/'); //berpindah ke halaman dashboard dengan router ('/')
        }else{
            console.log('login failed');
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
                    <p className="auth-title">Login Page</p>
                    <input className="input" id="email" placeholder="Email" type="text" onChange={this.handleChangeText} value={this.state.email} />
                    <input className="input" id="password" placeholder="Password" type="password" onChange={this.handleChangeText} value={this.state.password} />
                    {/* <button className="btn" onClick={this.handleRegisterSubmit}>Register</button> */}
                    <Button onClick={this.handleLoginSubmit} title='Login' loading={this.props.isLoading} />
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
    loginAPI: (data) => dispatch (loginUserAPI(data))
})

export default connect(reduxState, reduxDispatch) (Login);