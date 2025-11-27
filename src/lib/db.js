// src/lib/db.js
import { db } from "../firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

export async function saveRecipe({ uid, email, prompt, recipeText }) {
  const ref = collection(db, "recipes");
  const payload = {
    ownerId: uid,  
    email: email || null,
    prompt,
    recipeText,
    createdAt: serverTimestamp(),
  };
  const res = await addDoc(ref, payload);
  return res.id;
}

export function subscribeUserRecipes(uid, cb) {
  const ref = collection(db, "recipes");
  const qy = query(
    ref,
    where("ownerId", "==", uid),  
    orderBy("createdAt", "desc")
  );
  return onSnapshot(qy, cb);
  
}

export async function deleteRecipe(id) {
  return deleteDoc(doc(db, "recipes", id));
}
