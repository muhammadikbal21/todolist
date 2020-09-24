import React, {Component, Fragment} from 'react';
import './Dashboard.scss';
import { addDataToAPI, getDataToAPI, updateDataToAPI, deleteDataToAPI } from '../../../config/redux/dispatch';
import { connect } from 'react-redux';

class Dashboard extends Component{
    state = {
        title: '',
        content: '',
        date: '',
        textButton: 'SIMPAN', //membuat state awal dari button dengan nama SIMPAN
        noteId: '' //karena kita membutuhkan state baru pada updateAPI
    }

    componentDidMount(){ //setelah dirender data akan di panggil (get)
        const userData = JSON.parse(localStorage.getItem('userData'))
        this.props.getNotes(userData.uid); //menggunakan user id di localStorage sebagai nilainya
    }

    // componentDidMount(){ //proses ini setelah di render
    //     const userData = localStorage.getItem('userData'); //memanggil localStorage di Login.js dengan parameter userData
    //     console.log('dashboard' , JSON.parse(userData)); //JSON.parse untuk mengembalikan nilai dari string (di Login.js) menjadi object
    // }

    handleSaveNotes = () => {
        const {title, content,textButton, noteId} = this.state;
        const {saveNotes, updateNotes} = this.props;
        const userData = JSON.parse(localStorage.getItem('userData')) //menyimpan data login ke localStorage jika merefresh halaman tidak akan login kembali
        const data = {
            title: title,
            content: content,
            date: new Date().getTime(),
            userId: userData.uid //menggunakan uid sebagai menyimpan data diatas
        }
        if(textButton === 'SIMPAN'){
            saveNotes(data) //bisa juga menggunakan this.props.saveNotes, karena kita sudah menggunakan memendekkan dengan const
        } else {
            data.noteId = noteId; // membuat object data.noteId dengan state noteId
            updateNotes(data) //memanggil fungsi update API
        }
        this.setState({ //membersihkan form ketika sudah disimpan atau update
            title: '',
            content: ''
        })
        console.log(data);
    }

    onInputChange = (e, type) => {
        this.setState({
            [type] : e.target.value //mengambil value dari inputnya, kemudian type digunakan untuk menentukan state mana yang ingin diubah
        })
    }

    changeToUpdateNotes = (note) => { //parameter note menyimpan object dari state global notes dari reducer 
        console.log(note);
        this.setState({
            title: note.data.title,
            content: note.data.content,
            textButton: 'UPDATE', //merubah tulisan button SIMPAN menjadi UPDATE setelah diklik note nya
            noteId: note.id //menjadikan noteId yang kosong sebagai id yang akan diupdate
        })
    }

    cancelUpdate = () => {
         this.setState({
            title: '',
            content: '',
            textButton: 'SIMPAN'
        })
    }

    deleteNote = (e, note) => {
        console.log(e);
        const {deleteNote} = this.props;
        e.stopPropagation(); //membuat fungsi ketika diklik, component induknya (update) tidak ikut terklik
        const userData = JSON.parse(localStorage.getItem('userData')) //menyimpan data login ke localStorage jika merefresh halaman tidak akan login kembali
        const data = {
            userId: userData.uid,
            noteId: note.id
        }
        deleteNote(data);
    }

    render(){
        const {title, content, date, textButton} = this.state;
        const {notes} = this.props;
        console.log('notes: ', notes); //melihat object yang dimiliki notes
        return(
            <div className="container">
                <div className="input-form">
                    <input placeholder="title" className="input-title" value={title} onChange={(e) => this.onInputChange(e, 'title')} />
                    <textarea placeholder="content" className="input-content" value={content} onChange={(e) => this.onInputChange(e, 'content')} />
                    <div className="action-wrapper">
                        {
                            textButton === 'UPDATE' ? ( //jika kita mengklik note (proses Update), maka button cancel akan muncul 
                            <button className="save-btn cancel" onClick={this.handleSaveNotes} onClick={this.cancelUpdate}>Cancel</button>
                            ) : <div/> //jika tidak maka button cancel tidak akan muncul
                        }                        
                        <button className="save-btn" onClick={this.handleSaveNotes}>{textButton}</button>                        
                    </div>
                    
                </div>
                <hr/>
                { //dibawah ini adalah melooping data yang sudah ada di firebase
                    notes.length > 0 ? ( //jika jumlah array lebih besar dari 0 maka merender coding dibawah
                        <Fragment>
                            { 
                                notes.map (note => { //note sebagai parameter dari notes yang berisi object
                                    return ( //ketika melooping kita harus memanggil key nya
                                        <div className="card-content" key={note.id} onClick={()=>this.changeToUpdateNotes(note)}>
                                            {/*mengirim object notes sebagai parameter note di updateNotes adalah data permasing masing object yang kita mapping*/}
                                            <p className="title">{note.data.title}</p>
                                            <p className="date">{note.data.date}</p>
                                            <p className="content">{note.data.content}</p>
                                            <div className="delete-btn" onClick={(e) => this.deleteNote(e, note)}>X</div>
                                        </div>
                                    )
                                })
                            }
                            
                        </Fragment>
                    ) : null //jika tidak maka tidak dirender
                }
                
            </div>
        )
    }
}

const reduxState = (state) => ({
    userData: state.user, //state.user berasal dari state di reducer
    notes: state.notes
})

const reduxDispatch = (dispatch) => ({
    saveNotes: (data) => dispatch (addDataToAPI(data)),
    getNotes: (data) => dispatch (getDataToAPI(data)),
    updateNotes: (data) => dispatch (updateDataToAPI(data)),
    deleteNote: (data) => dispatch (deleteDataToAPI(data))
})

export default connect(reduxState, reduxDispatch) (Dashboard);