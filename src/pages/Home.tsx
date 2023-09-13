import { Button } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            const response = await axios.post(
                'http://127.0.0.1:5000/clear-session-user',
                {},
                {
                    withCredentials: true,
                }
            )
            console.log('Server response:', response.data)
            navigate('/login')
        } catch (error) {
            console.error('Error:', error)
        }
    }

    return (
        <div id='home-page'>
            <div>home</div>
            <Button type='primary' onClick={handleLogout}>
                Logout
            </Button>
        </div>
    )
}

export default Home
