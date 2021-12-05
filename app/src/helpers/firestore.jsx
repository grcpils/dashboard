import { db } from './../helpers/firebase';
import { doc, setDoc, updateDoc, getDoc, getDocs, collection, deleteDoc } from 'firebase/firestore/lite';

export async function setToken(user, serviceName, token) {
    if (user) {
      const userTokensRef = doc(db, "users", user.uid, "tokens", serviceName);
      const data = { token: token };

      await setDoc(userTokensRef, data);
    }
}

export async function addWidget(user, key, widget) {
    if (user) {
      const userWidgetsRef = doc(db, "users", user.uid, "widgets", key);
      const data = JSON.parse( JSON.stringify({data: widget}))

      await setDoc(userWidgetsRef, data);
    }
}

export async function deleteWidget(user, key) {
  await deleteDoc(doc(db, `users/${user.uid}/widgets/${key}`));
}

export async function updateWidget(user, key, widget) {
  if (user) {
    const userWidgetsRef = doc(db, `users/${user.uid}/widgets/${key}`);
    const data = JSON.parse( JSON.stringify({data: widget}))

    await updateDoc(userWidgetsRef, data);
  }
}

export async function saveLayout(user, layouts) {
    if (user) {
      const userLayoutRef = doc(db, "users", user.uid);
      const data = JSON.parse( JSON.stringify({layouts: layouts}))

      await updateDoc(userLayoutRef, data);
    }
}

export async function getLayout(user) {
    if (user) {
      const userLayoutRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userLayoutRef);

      if (docSnap.exists()) {
        const layouts = docSnap.data().layouts;
        if (layouts !== undefined)
          return layouts;
      } else {
        console.log("No such document!");
      }
    }
}

export async function getWidgetsList(user) {
  let widgets = [];
  if (user) {
    const docSnap = await getDocs(collection(db, `users/${user.uid}/widgets`));
    docSnap.forEach((doc) => {
      widgets.push(doc.data().data);
    });
  }
  return widgets;
}