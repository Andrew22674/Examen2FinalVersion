//import ReactNative from "react-native";
import * as firebase from 'firebase';


const firebaseConfig = {
  apiKey: "AIzaSyBcn0RWwim2VHjfcNTqYTLd14QLdY-VASs",
  authDomain: "examen2-40e8e.firebaseapp.com",
  databaseURL: "https://examen2-40e8e.firebaseio.com",
  projectId: "examen2-40e8e",
  storageBucket: "examen2-40e8e.appspot.com",
  messagingSenderId: "848246406013"
};


export var fire = firebase.initializeApp(firebaseConfig);

//module.exports  = fire;
