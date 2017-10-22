import * as firebase from 'firebase';

export default function isLogined() {
  return firebase.auth()
}