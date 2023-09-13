import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Login from './pages/Login'

interface AuthGuardProps {
    isAuthenticated: boolean
    targetPage: React.ReactNode
}

const AuthGuard: React.FC<AuthGuardProps> = ({
    isAuthenticated,
    targetPage,
}) => {
    const navigate = useNavigate()
    const componentName = (targetPage as any)?.name

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
        } else {
            if (componentName === 'Login') {
                navigate('/home')
            }
        }
    }, [])

    return isAuthenticated ? targetPage : <Login />
}

export default AuthGuard
