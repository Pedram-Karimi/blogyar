import { useEffect, useState } from "react"; // react-hooks

// firebase storage tools

import { storage } from "../../Firebase/FirebaseConfig"; // firebase storage ref
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";

import { db } from "../../Firebase/FirebaseConfig"; // firebase db ref

import { doc, setDoc } from "firebase/firestore"; // firestore tools

import "./userDetail.css"; // styles

// contexts

import { useUserAuth } from "../../context/UserAuthContext";
import { useNavigate } from "react-router-dom";

// componets

import UserPosts from "./components/UserPosts";
import UserBookmarks from "./components/UserBookmarks";
import UserSubscriptions from "./components/UserSubscriptions";

const UserDetail: React.FC = () => {
  //---
  // use contexts---

  const { logOut, user, userDataState, userSubs } = useUserAuth();

  // variables---

  const [imageUpload, setImageUpload] = useState<Blob>();
  const [profileImage, setProfileImage] = useState<string>();
  const [updateCheck, setUpdateCheck] = useState<Boolean>(false);
  const [postsMenu, setPostsMenu] = useState<string>("posts");
  const [currUserName, setCurrUserName] = useState<string>("");
  const [currUserBio, setCurrUserBio] = useState<string>("");

  const navigate = useNavigate(); // react-router navigate

  // uploud user profile pic to firebase storage ------------------------------

  useEffect(() => {
    try {
      if (imageUpload && user) {
        const imageRef = ref(storage, `${user?.uid + "_profilePic"}/img`);
        uploadBytes(imageRef, imageUpload).then(() => {
          setUpdateCheck(true);
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, [imageUpload, user]);

  // download uploaded img's url ------------------------------

  useEffect(() => {
    try {
      if (user && !userDataState?.UserProfile) {
        const imgListRef = ref(storage, `${user.uid + "_profilePic"}/`);
        listAll(imgListRef).then((response) => {
          getDownloadURL(response.items[0]).then((url) => {
            setProfileImage(url);
            setUpdateCheck(false);
          });
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, [updateCheck, user]);

  // set downloaded url to user's firestore document ------------------------------

  useEffect(() => {
    try {
      if (user && profileImage) {
        const userRef = doc(db, "users", user.uid);
        setDoc(
          userRef,
          {
            UserProfile: profileImage,
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.log(err);
    }
  }, [profileImage, user, updateCheck]);

  // get the user's current username and bio ------------------------------

  useEffect(() => {
    if (userDataState.UserName) {
      setCurrUserName(userDataState.UserName);
      setCurrUserBio(userDataState?.Bio);
    }
  }, [userDataState]);

  // submit changes to firstore db ------------------------------

  const submitChange = async () => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        const setUpdatedData = await setDoc(
          userRef,
          {
            Bio: currUserBio,
            UserName: currUserName,
          },
          { merge: true }
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  // jsx---
  return (
    <div className="user-detail">
      <div className="genrall-info-config">
        <button
          className="sign-out-btn"
          onClick={() => {
            logOut();
            navigate("/");
          }}
        >
          Sign out
        </button>
        <div
          className="change-profile-pic-div"
          style={{
            background: `url(${userDataState?.UserProfile})`,
          }}
        >
          <label htmlFor="inputTag-avatar" className="inputTag-avatar">
            <input
              type="file"
              id="inputTag-avatar"
              className="choose-file"
              onChange={(e: any) => {
                setImageUpload(e.target.files[0]);
              }}
            />
          </label>
          <div>
            <svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 470 470"
            >
              <g>
                <g>
                  <g>
                    <path
                      d="M307.5,117.5C234.439,117.5,175,176.939,175,250s59.439,132.5,132.5,132.5S440,323.061,440,250
				S380.561,117.5,307.5,117.5z M307.5,367.5C242.71,367.5,190,314.79,190,250s52.71-117.5,117.5-117.5S425,185.21,425,250
				S372.29,367.5,307.5,367.5z"
                    />
                    <path
                      d="M367.5,250c0-33.084-26.916-60-60-60s-60,26.916-60,60s26.916,60,60,60S367.5,283.084,367.5,250z M262.5,250
				c0-24.813,20.187-45,45-45s45,20.187,45,45s-20.187,45-45,45S262.5,274.813,262.5,250z"
                    />
                    <path
                      d="M432.5,87.5H163.126V65c0-4.142-3.358-7.5-7.5-7.5H67.5c-4.142,0-7.5,3.358-7.5,7.5v22.5H37.5
				C16.822,87.5,0,104.322,0,125v250c0,20.678,16.822,37.5,37.5,37.5h395c20.678,0,37.5-16.822,37.5-37.5V125
				C470,104.322,453.178,87.5,432.5,87.5z M75,72.5h73.126v15H75V72.5z M455,375c0,12.407-10.093,22.5-22.5,22.5h-395
				C25.093,397.5,15,387.407,15,375V125c0-12.407,10.093-22.5,22.5-22.5h395c12.407,0,22.5,10.093,22.5,22.5V375z"
                    />
                    <path
                      d="M307.5,147.5c-21.735,0-42.519,6.75-60.104,19.521c-3.352,2.434-4.095,7.124-1.661,10.476
				c2.433,3.351,7.123,4.096,10.476,1.661c15.006-10.898,32.742-16.658,51.29-16.658c48.248,0,87.5,39.252,87.5,87.5
				c0,48.248-39.252,87.5-87.5,87.5C259.253,337.5,220,298.248,220,250c0-18.547,5.76-36.283,16.659-51.29
				c2.434-3.352,1.69-8.042-1.662-10.476c-3.353-2.434-8.043-1.69-10.476,1.662C211.75,207.481,205,228.265,205,250
				c0,56.519,45.981,102.5,102.5,102.5S410,306.519,410,250C410,193.481,364.019,147.5,307.5,147.5z"
                    />
                    <path
                      d="M137.5,117.5h-80C42.336,117.5,30,129.836,30,145s12.336,27.5,27.5,27.5h80c15.164,0,27.5-12.336,27.5-27.5
				S152.664,117.5,137.5,117.5z M137.5,157.5h-80c-6.893,0-12.5-5.607-12.5-12.5s5.607-12.5,12.5-12.5h80
				c6.893,0,12.5,5.607,12.5,12.5S144.393,157.5,137.5,157.5z"
                    />
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </div>
        <div className="genral-info-edit">
          <input
            className="current-user-name"
            value={currUserName}
            onChange={(e) => {
              setCurrUserName(e.target.value);
            }}
          />
          <input
            className="current-user-bio"
            value={currUserBio}
            placeholder="Bio"
            onChange={(e) => {
              setCurrUserBio(e.target.value);
            }}
          />
          <button
            className={`submit-profile-chnage ${
              currUserBio === userDataState?.Bio &&
              currUserName === userDataState?.UserName &&
              "submit-profile-chnage-disable"
            }`}
            onClick={submitChange}
          >
            submit
          </button>
        </div>
      </div>
      <div className="current-user-short-info">
        <p>Followers: {userDataState?.Followers}</p>
        <p>Subscriptions: {userSubs?.length}</p>
      </div>
      <div className="user-posts-menu">
        <h2
          className={postsMenu == "posts" ? "posts-menu-active" : ""}
          onClick={() => {
            setPostsMenu("posts");
          }}
        >
          Your posts
        </h2>
        <h2
          className={postsMenu == "bookmarks" ? "posts-menu-active" : ""}
          onClick={() => {
            setPostsMenu("bookmarks");
          }}
        >
          Book marks
        </h2>
        <h2
          className={postsMenu == "Subscriptions" ? "posts-menu-active" : ""}
          onClick={() => {
            setPostsMenu("Subscriptions");
          }}
        >
          Subscriptions
        </h2>
      </div>
      {postsMenu == "posts" && <UserPosts />}
      {postsMenu == "bookmarks" && <UserBookmarks />}
      {postsMenu == "Subscriptions" && <UserSubscriptions />}
    </div>
  );
};

export default UserDetail;
