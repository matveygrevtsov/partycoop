import firebase from 'firebase'
import 'firebase/auth'

var firebaseConfig = {
  apiKey: 'AIzaSyApRS9_Ve50YeNxf6rxLY3iVmU71l2GXec',
  authDomain: 'partycoop-18284.firebaseapp.com',
  projectId: 'partycoop-18284',
  storageBucket: 'partycoop-18284.appspot.com',
  messagingSenderId: '419959053416',
  appId: '1:419959053416:web:f94e651fed6603c651afdd',
  measurementId: 'G-G441DR9YLC',
}
const firebaseApp = firebase.initializeApp(firebaseConfig)


export default firebaseApp
