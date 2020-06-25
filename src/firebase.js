import firebase from 'firebase/app';
import 'firebase/database';


  const firebaseConfig = {
    apiKey: "AIzaSyB8ba9uHk5_K9sJaxXejBFESn7R1r6AZOE",
    authDomain: "krystafur-toyota-project-five.firebaseapp.com",
    databaseURL: "https://krystafur-toyota-project-five.firebaseio.com",
    projectId: "krystafur-toyota-project-five",
    storageBucket: "krystafur-toyota-project-five.appspot.com",
    messagingSenderId: "1039705567044",
    appId: "1:1039705567044:web:4ce84acd11df7e34bef111"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export default firebase;