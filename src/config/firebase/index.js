import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCG44Poc5Ho6uzEW3Yli_cPDUYzOgU0lW0",
    authDomain: "todolist-f0b51.firebaseapp.com",
    databaseURL: "https://todolist-f0b51.firebaseio.com",
    projectId: "todolist-f0b51",
    storageBucket: "todolist-f0b51.appspot.com",
    messagingSenderId: "701274573335",
    appId: "1:701274573335:web:424b689206cd6b71b9aa52",
    measurementId: "G-ETTVEYRDEE"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
//   firebase.analytics();

// Get a reference to the database service
export const database = firebase.database();

export default firebase;
