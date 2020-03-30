import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

var firebaseConfig = {
  apiKey: "AIzaSyBtZUWeSO_j20IzoZavP_uMweYbo8t3Cpo",
  authDomain: "indigo-cabinet.firebaseapp.com",
  databaseURL: "https://indigo-cabinet.firebaseio.com",
  projectId: "indigo-cabinet",
  storageBucket: "indigo-cabinet.appspot.com",
  messagingSenderId: "369879734897",
  appId: "1:369879734897:web:90c5b9286c4e9a941a19d0",
  measurementId: "G-VDD38KLX9E"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();
