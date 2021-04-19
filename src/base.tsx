import Rebase from 're-base' // для связки react и firebase
import firebaseApp from './firebaseApp'
import 'firebase/firestore'

const base = Rebase.createClass(firebaseApp.database())

export default base
