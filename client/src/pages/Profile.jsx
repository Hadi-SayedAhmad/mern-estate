import React, { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
export default function Profile() {
  const { currentUser, loading } = useSelector((state) => state.user);
  const [ formData, setFormData ] = useState({});
  const [ file, setFile ] = useState(undefined);
  const [ filePerc, setFilePerc ] = useState(0);
  const [ fileUploadError, setFileUploadError ] = useState(false);

  const fileRef = useRef(null);

  
  console.log(formData);
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

  const handleFileUpload =  (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask =  uploadBytesResumable(storageRef, file);
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

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Your Profile</h1>
      <form className="flex flex-col gap-3">
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
          value={formData.username}
          defaultValue={currentUser.username}
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg outline-none"
          id="username"
          onChange={handleChange}
        />
        <input
          value={formData.email}
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
        {/* <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95" to={"/create-listing"}>
          Create Listing
        </Link> */}
      </form>
      {/* <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className="text-red-700 cursor-pointer hover:opacity-95">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer hover:opacity-95">Sign Out</span>
      </div> */}
    </div>
  );
}
