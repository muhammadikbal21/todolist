import firebase, { database } from '../../firebase';

export const actionUserName = () => (dispatch) => {
    setTimeout(() => {
        return dispatch ({type: 'CHANGE_USER', value: 'Muhammad Ikbal'})
    }, 2000) //membuat jeda waktu atau asynchronus
    //ketika actionnya dipanggil maka nilainya akan berubah setelah 2 detik
}

export const registerUserAPI = (data) => (dispatch) => { //membuat register API dengan firebase
    return new Promise ((resolve, reject) => { //memberikan informasi kepada user bahwa kita memberikan result seperti resolve jika berhasil dan reject jika gagal
        dispatch({type: 'CHANGE_LOADING', value: true}) //mengubah state isLoading menjadi true
        firebase.auth().createUserWithEmailAndPassword(data.email, data.password) //email dan password adalah nilai dari state pada register
        .then(res => { //setelah data berhasil masuk ke firebase, maka kita keluarkan hasilnya/result
            console.log('success : ', res);
            dispatch({type: 'CHANGE_LOADING', value: false}) //setelah itu maka state isLoading kembali menjadi false
            resolve(true); //resolve true akan diteruskan ke method handleRegisterSubmit pada Register
        })
        .catch(function(error) { //jika error maka akan menampilkan pesan error      
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage)
            dispatch({type: 'CHANGE_LOADING', value: false})
            reject(false);
        })    
    })

    
}

export const loginUserAPI = (data) => (dispatch) => {
    return new Promise ((resolve, reject) => {
        dispatch({type: 'CHANGE_LOADING', value: true})    
        firebase.auth().signInWithEmailAndPassword(data.email, data.password) //email dan password adalah nilai dari this.state
        .then(res => {
            console.log('success : ', res); //ketika berhasil login akan menghasilkan nilai res
            const dataUser = { //membuat object dari res dan memilih object dibawah ini yang akan digunakan
                email: res.user.email,
                uid: res.user.uid,
                emailVerified: res.user.emailVerified,
                refreshToken: res.user.refreshToken
            }
            dispatch({type: 'CHANGE_LOADING', value: false})
            dispatch({type: 'CHANGE_ISLOGIN', value: true}) //jika berhasil login akan lari ke dashboard
            dispatch({type: 'CHANGE_USER', value: dataUser})
            resolve(dataUser); //jika berhasil maka akan menampilkan object dari dataUser
        })
        .catch(function(error) {           
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage)
            dispatch({type: 'CHANGE_LOADING', value: false})
            dispatch({type: 'CHANGE_ISLOGIN', value: false}) //akan menampilkan pesan error
            reject(false);
        })       
    })
    
}

export const addDataToAPI = (data) => (dispatch) => { //data berasal dari handleSaveNotes di Dashboard.js
    database.ref('notes/' + data.userId).push({ //push berfungsi untuk menambah nilai baru ketika membuat data yang baru
        title: data.title,
        content: data.content,
        date: data.date
    })
}

export const getDataToAPI = (userId) => (dispatch) => {
    const urlNotes = database.ref ('notes/' + userId);
    return new Promise ((resolve, reject) => {
        urlNotes.on('value', function (snapshot) { //mereload data terbaru ketika kita membuat data yang baru
            console.log('get Data : ', snapshot.val()); //snapshot adalah sebuah object 
            const data = []; //membuat const data sebagai array, merubah sebuah object menjadi array
            Object.keys(snapshot.val()).map(key => { //map berfungsi untuk merubah nilai baru pada array
                //key adalah id dari data notes yang digunakan sebagai pemanggil value dari object
                data.push({ //push berfungsi untuk menambah nilai baru ketika membuat data yang baru kedalam array
                    id: key, //key sebagai id dari notes
                    data: snapshot.val()[key] //memanggil nilai snapshot.val dengan key(id)
                })
            });                
            dispatch ({type: 'SET_NOTES', value: data})
            resolve(snapshot.val())
        });  
    })
        
}

export const updateDataToAPI = (data) => (dispatch) => { //mengirim parameter data
    const urlNotes = database.ref (`notes/${data.userId}/${data.noteId}`); //url yang dituju untuk diupdate
    return new Promise ((resolve, reject) => {
        urlNotes.set({ //mengupdate data dibawah ini
            title: data.title,
            content: data.content,
            date: data.date
        }, (err) => { //menyimpan semua data baru yang ingin kita gantikan
            //parameter error adalah callback sehingga kalau errornya bernilai true maka kita akan reject
            if(err){
                reject(false); 
            } else {
                resolve(true)
            }
        })
    })
        
}

export const deleteDataToAPI = (data) => (dispatch) => { //mengirim parameter data
    const urlNotes = database.ref (`notes/${data.userId}/${data.noteId}`); //url yang dituju untuk dihapus
    return new Promise ((resolve, reject) => {
        urlNotes.remove();
    })
}