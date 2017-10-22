import * as firebase from 'firebase';

export default function findUser(userUID) {
  const db = firebase.firestore();
  return db
    .doc(`users/${userUID}`)
    .get()
    .then(snapshot => snapshot.exists ? snapshot.data() : undefined);
}
