import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAkeZiemZ3_HqUscZ6CzH3CFt2vMe2saEE",
    authDomain: "pposong-instagram.firebaseapp.com",
    databaseURL: "https://pposong-instagram-default-rtdb.firebaseio.com",
    projectId: "pposong-instagram",
    storageBucket: "pposong-instagram.appspot.com",
    messagingSenderId: "926277699492",
    appId: "1:926277699492:web:880227a4d06456d7cc2331",
    measurementId: "G-LDSJPM6B53"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };