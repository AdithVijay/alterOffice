import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import React from 'react'

const PrivateRoute = ({children}) => {
    const user = useSelector((state) => state.user.users)
    if(!user){
        return <Navigate to={"/login"}/>
    }
    return children
}

export default PrivateRoute
