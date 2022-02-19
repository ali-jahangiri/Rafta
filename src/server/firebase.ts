import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyDzLzRrLZ7VnOXJe2jZcwJxiWtGODsGzBY",
    authDomain: "fir-playgro.firebaseapp.com",
    projectId: "fir-playgro",
    storageBucket: "fir-playgro.appspot.com",
    messagingSenderId: "427135388306",
    appId: "1:427135388306:web:e2a5295bb1db445c15f44b"
};


const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();


export {
    db,
}