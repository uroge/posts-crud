import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';

var config = {
    apiKey: "AIzaSyCJNEAOIcs6Thc_MBq5I4GX4AufkLBSUEc",
    authDomain: "posts-crud-9a799.firebaseapp.com",
    projectId: "posts-crud-9a799",
    storageBucket: "posts-crud-9a799.appspot.com",
    messagingSenderId: "812334709383",
    appId: "1:812334709383:web:be4d0811a731089af8d622",
    measurementId: "G-VNXLB46QCF"
};

export const app = firebase.initializeApp(config);