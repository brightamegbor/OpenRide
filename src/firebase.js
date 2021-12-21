import { initializeApp } from 'firebase/app';
// import {getFirestore} from 'firebase/firestore'


const firebaseConfig = {
    apiKey: `${process.env.local.FIREBASE_API_KEY}`,
    authDomain: `${process.env.local.FIREBASE_AUTH_DOMAIN}`,
    projectId: `${process.env.local.FIREBASE_PROJECT_ID}`,
    storageBucket: `${process.env.local.FIREBASE_STORAGE_BUCKET}`,
    messagingSenderId: `${process.env.local.FIREABSE_MESSAGING_SENDER_ID}`,
    appId: `${process.env.local.FIREBASE_APP_ID}`,
};

const firebase = initializeApp(firebaseConfig);

// getFirestore.settings(settings);

export default firebase;