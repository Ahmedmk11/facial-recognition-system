import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface AuthGuardProps {
    isAuthenticated: boolean
    targetPage: React.ReactNode
}

const AuthGuard: React.FC<AuthGuardProps> = ({
    isAuthenticated,
    targetPage,
}) => {
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
        }
    }, [isAuthenticated, navigate])

    return isAuthenticated ? targetPage : null
}

export default AuthGuard
