import firebase from 'firebase/app';
require('firebase/database');

const config = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASEURL,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENTID,
};

firebase.initializeApp(config);

export const getFirebaseRegionData = async regionName =>
  await firebase
    .database()
    .ref(`/${regionName}`)
    .once('value')
    .then(data => data.val());

export const getFirebaseRegionProfile = async regionName =>
  await firebase
    .database()
    .ref(`/CIA factbook data/countries/${regionName}`)
    .once('value')
    .then(res => (res.val() ? res.val().data : null));
