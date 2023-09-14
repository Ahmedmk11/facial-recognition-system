import React, { useEffect, useState } from 'react'
import {
    Routes,
    Route,
    useLocation,
    Navigate,
    useNavigate,
} from 'react-router-dom'
import axios from 'axios'

import Home from './pages/Home'
import Login from './pages/Login'
import Logout from './pages/Logout'
import Register from './pages/Register'
import AuthGuard from './AuthGuard'
import Profile from './pages/Profile'
import Attendance from './pages/Attendance'

const RouteSwitch = () => {
    const location = useLocation()
    const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null)

    useEffect(() => {
        axios
            .get('http://127.0.0.1:5000/api/check-session', {
                withCredentials: true,
            })
            .then((response) => {
                const { authenticated } = response.data
                setIsAuthenticated(authenticated)
            })
            .catch((error) => {
                console.log("Can't get authentication: ", error)
                setIsAuthenticated(false)
            })
    }, [])

    useEffect(() => {
        console.log(isAuthenticated)
    }, [isAuthenticated])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location])

    if (isAuthenticated === null) {
        return null
    }

    return (
        <Routes>
            <Route
                path='/'
                element={
                    <AuthGuard
                        isAuthenticated={isAuthenticated}
                        targetPage={<Home />}
                    />
                }
            />
            <Route
                path='/home'
                element={
                    <AuthGuard
                        isAuthenticated={isAuthenticated}
                        targetPage={<Home />}
                    />
                }
            />
            <Route
                path='/logout'
                element={
                    <AuthGuard
                        isAuthenticated={isAuthenticated}
                        targetPage={<Logout />}
                    />
                }
            />

            <Route path='/register' element={<Register />} />
            <Route
                path='/login'
                element={
                    <AuthGuard
                        isAuthenticated={!isAuthenticated}
                        targetPage={<Login />}
                    />
                }
            />
            <Route
                path='/profile'
                element={
                    <AuthGuard
                        isAuthenticated={isAuthenticated}
                        targetPage={<Profile />}
                    />
                }
            />
            <Route
                path='/attendance'
                element={
                    <AuthGuard
                        isAuthenticated={isAuthenticated}
                        targetPage={<Attendance />}
                    />
                }
            />
        </Routes>
    )
}

export default RouteSwitch
