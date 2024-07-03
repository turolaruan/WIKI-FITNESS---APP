// Import the functions you need from the SDKs you need
import firebase from "firebase";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCx8u81x5MA_ih4JwAdB3pDV9UsQpSBBPM",
  authDomain: "projeto-cm-6c17f.firebaseapp.com",
  databaseURL: "https://projeto-cm-6c17f-default-rtdb.firebaseio.com",
  projectId: "projeto-cm-6c17f",
  storageBucket: "projeto-cm-6c17f.appspot.com",
  messagingSenderId: "560213895017",
  appId: "1:560213895017:web:3da24df9c53d8c5e097ff8"
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;