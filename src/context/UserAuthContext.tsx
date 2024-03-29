import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../Firebase/FirebaseConfig";
const userContext = createContext<any>(null);

type ChildComponents = {
  children: JSX.Element;
};

export function UserAuthProvider({ children }: ChildComponents) {
  const [userDataState, setUserDataState] = useState({});
  const [userBookmarks, setUserBookmarks] = useState<any>([]);
  const [userSubs, setUserSubs] = useState([]);
  const [userLikes, setUserLikes] = useState([]);
  const [user, setUser] = useState();
  function signIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function logOut() {
    signOut(auth);
    setUserDataState({});
    setUserSubs([]);
    setUserBookmarks({});
    setUserLikes([]);
  }
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser: any) => {
      setUser(currentUser);
    });
  }, [user]);
  if (user) {
    const userSnapshot = onSnapshot(
      doc(db, "users", user["uid"]),
      (doc: any) => {
        if (
          doc.data()?.Bio !== userDataState["Bio"] &&
          doc.data().UserName !== userDataState["UserName"] &&
          doc.data().Followers !== userDataState["Followers"] &&
          doc.data().id !== userDataState["id"]
        ) {
          setUserDataState(doc.data());
        }
      }
    );
    const bookmarksSnapshot = onSnapshot(
      doc(db, "Bookmarks", user["uid"]),
      (doc) => {
        if (doc.data()?.bookmarks?.length !== userBookmarks?.length) {
          if (doc.data()?.bookmarks) setUserBookmarks(doc.data()?.bookmarks);
        }
      }
    );
    const subscriptionsSnapshot = onSnapshot(
      doc(db, "subscriptions", user["uid"]),
      (doc) => {
        if (doc.data()?.subscriptions?.length !== userSubs?.length) {
          if (doc.data()?.subscriptions) setUserSubs(doc.data()?.subscriptions);
        }
      }
    );
    const likesSnapshot = onSnapshot(doc(db, "Likes", user["uid"]), (doc) => {
      if (doc.data()?.likes?.length !== userLikes?.length) {
        if (doc.data()?.likes) setUserLikes(doc.data()?.likes);
      }
    });
  }
  return (
    <userContext.Provider
      value={{
        user,
        signIn,
        logOut,
        userDataState,
        userLikes,
        userBookmarks,
        userSubs,
      }}
    >
      {children}
    </userContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userContext);
}
