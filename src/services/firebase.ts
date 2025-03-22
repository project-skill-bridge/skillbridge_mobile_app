import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: 'AIzaSyCtOLPI5IX7GmxazVgnn1haBUvZl2sxgN4',
  authDomain: 'skill-bridge-37dd8.firebaseapp.com',
  projectId: 'skill-bridge-37dd8',
  storageBucket: 'skill-bridge-37dd8.appspot.com',
  messagingSenderId: '751692701677',
  appId: '1:751692701677:android:19248b941f66d2458d11e4',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db};