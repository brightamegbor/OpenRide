import { initializeApp } from 'firebase/app';
import firestore from 'firebase/firestore'

const settings = { timestampsInSnapshots: true };

const firebaseConfig = {
    apiKey: "AIzaSyBQMx8j9O9QiJLvIDYwM1vJzw-KTCJPjqk",
    authDomain: "open-ryde.firebaseapp.com",
    projectId: "open-ryde",
    storageBucket: "open-ryde.appspot.com",
    messagingSenderId: "4011188406",
    appId: "1:4011188406:web:2645fd5ca02b3f45f0c617"
};

const firebase = initializeApp(firebaseConfig);

firebase.firestore().settings(settings);

export default firebase;