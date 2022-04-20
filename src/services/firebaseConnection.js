import firebase from "firebase/app";
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBUaD9oEUudbFBk6ASELVfAah7ArTGOLxs",
    authDomain: "sistema-dbad5.firebaseapp.com",
    projectId: "sistema-dbad5",
    storageBucket: "sistema-dbad5.appspot.com",
    messagingSenderId: "770392320685",
    appId: "1:770392320685:web:d2dcffb6af84be0b55f424",
    measurementId: "G-R8MJWT6G67"
  };
  
  if(!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
  }

  export default firebase