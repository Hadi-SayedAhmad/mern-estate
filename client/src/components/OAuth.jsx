import {useSelector, useDispatch} from 'react-redux'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase';
import {signInSuccess} from '../state/user/user.slice.js'
import { useNavigate } from 'react-router-dom'
export default function OAuth() {
    const {loading} = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            // console.log(result);
            const backendCall = await fetch("/api/auth/google", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                name: result.user.displayName,
                email: result.user.email,
                photoUrl: result.user.photoURL
              })
            })
            const backendResponse = await backendCall.json();
            dispatch(signInSuccess(backendResponse));
            navigate("/");
        } catch (error) {
            console.log("Could not continue with google!", error)
        }
    }
  
    return (
    <button
      disabled={loading}
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
    >
      {loading ? "loading..." : "Continue with Google"}
    </button>
  );
}
