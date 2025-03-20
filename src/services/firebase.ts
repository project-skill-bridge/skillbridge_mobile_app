// firebase.ts
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyCtOLPI5IX7GmxazVgnn1haBUvZl2sxgN4',
    authDomain: 'skill-bridge-37dd8.firebaseapp.com',
    projectId: 'skill-bridge-37dd8',
    storageBucket: 'skill-bridge-37dd8.firebasestorage.app',
    messagingSenderId: '751692701677',
    appId: '1:751692701677:android:19248b941f66d2458d11e4',
    measurementId: 'measurement-id',
  };

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // Use the existing app
}

// Export firebase as default
export default firebase;
