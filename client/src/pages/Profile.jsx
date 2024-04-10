import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "../state/user/user.slice";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state-changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done!");
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      async () => {
        try {
          const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData({
            ...formData,
            avatar: imageUrl,
          });
        } catch (error) {
          console.log("Upload image completed but can't get the url!", error);
        }
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const call = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const response = await call.json();
      if (response.success === false) {
        dispatch(updateUserFailure(response.message));
        return;
      }
      dispatch(updateUserSuccess(response));
      setUpdateSuccess(true);
      //putting password field as empty again.
      e.target[3].value = null;
      setFormData({});
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const call = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const response = await call.json();
      if (response.success === false) {
        dispatch(deleteUserFailure(response.message));
        return;
      }

      dispatch(deleteUserSuccess());
      navigate("/");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOutUser = async () => {
    try {
      dispatch(signOutStart());
      const call = await fetch("/api/auth/signout");
      const response = await call.json();
      if (response.success === false) {
        dispatch(signOutFailure(response.message));
        return;
      }
      dispatch(signOutSuccess());
      navigate("/");
    } catch (error) {
      console.log(error.message);
      dispatch(signOutFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Your Profile</h1>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        ></input>
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile photo"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-3 "
        />
        <p className="self-center text-sm">
          {fileUploadError ? (
            <span className="text-red-700">
              Can't upload image! Make sure your image is less than 2MB.
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">
              Upload complete! Update to apply changes.
            </span>
          ) : (
            ""
          )}
        </p>
        <input
          defaultValue={currentUser.username}
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg outline-none"
          id="username"
          onChange={handleChange}
        />
        <input
          defaultValue={currentUser.email}
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg outline-none"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg outline-none "
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Updating..." : "Update"}
        </button>
        {/* <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95" >
          Create Listing
        </Link> */}
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={() => {
            if (
              confirm("Are you sure that you want to delete your account?")
            ) {
              handleDeleteUser();
            }
          }}
          className="text-red-700 cursor-pointer hover:opacity-95"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOutUser}
          className="text-red-700 cursor-pointer hover:opacity-95"
        >
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error && error}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess && "Your profile has been updated successfully!"}
      </p>
    </div>
  );
}
