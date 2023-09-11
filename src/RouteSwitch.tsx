import React, { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import axios from 'axios'

import Home from './pages/Home'
import Login from './pages/Login'
import Logout from './pages/Logout'
import Register from './pages/Register'
import AuthGuard from './AuthGuard'

const RouteSwitch = () => {
    const location = useLocation()
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        axios
            .get('/api/check-session')
            .then((response) => {
                const { authenticated } = response.data
                setIsAuthenticated(authenticated)
            })
            .catch((error) => {
                console.log("Can't get authentication: ", error)
            })
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location])

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
            <Route path='/login' element={<Login />} />
        </Routes>
    )
}

export default RouteSwitch
