import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';

let app: FirebaseApp;
const firebaseConfig = {
  apiKey: 'AIzaSyCKhczb2irGEQ_iBkGOGXGIocdFXYGELSE',
  authDomain: 'nextchat-73718.firebaseapp.com',
  projectId: 'nextchat-73718',
  storageBucket: 'nextchat-73718.appspot.com',
  messagingSenderId: '558168708837',
  appId: '1:558168708837:web:448c0ec0b2850b4574a60c',
  measurementId: 'G-0LZ2M5YZP5',
};

if (getApps().length) {
  app = getApp();
} else {
  app = initializeApp(firebaseConfig);
}

export default app;
