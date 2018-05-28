import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyAN_WmtNzPmXAxIZvU0PbEsVOCj4loFz9Q",
    authDomain: "potluck-33df5.firebaseapp.com",
    databaseURL: "https://potluck-33df5.firebaseio.com",
    projectId: "potluck-33df5",
    storageBucket: "potluck-33df5.appspot.com",
    messagingSenderId: "575482416247"
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();

export default firebase;