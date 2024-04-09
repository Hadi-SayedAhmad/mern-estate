import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { Outlet } from "react-router-dom"

export default function PrivateRoute() {
    const {currentUser} = useSelector((state) => {
        return state.user
    })
    
    return (
        currentUser ? (<Outlet></Outlet>) : <Navigate to={"/sign-in"} />
  )
}

