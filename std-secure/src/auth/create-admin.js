import dotenv from "dotenv";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

dotenv.config();
const adminEmail =
  process.env.REACT_APP_ADMIN_EMAIL || "admin_secure@gmail.com";

const password = process.env.REACT_APP_ADMIN_PASSWORD || "admin_secure";

const postCollectionRef = collection(db, "users");

const checkAdminEmail = async () => {
  const querySnapshot = await getDocs(
    query(postCollectionRef, where("email", "==", adminEmail))
  );
  if (querySnapshot.size > 0) {
    const userDoc = querySnapshot.docs[0];
    const isAdmin = await userDoc.data().isAdmin;
    if (!isAdmin) {
      const userDocRef = doc(postCollectionRef, userDoc.id);
      await updateDoc(userDocRef, { isAdmin: true });
      console.log("User with email " + adminEmail + " is now a admin");
    } else if (isAdmin) {
      console.log("User with email " + adminEmail + " is already an admin");
    }
  } else {
    await addDoc(postCollectionRef, {
      name: "Admin",
      email: adminEmail,
      password,
      isAdmin: true,
    });
    console.log("Admin with email " + adminEmail + " created successfully");
  }
};

checkAdminEmail();