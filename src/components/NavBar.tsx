import React, { useEffect, useState } from 'react'
import { Form, Input, Button, DatePicker, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import IconImg from '../assets/images/ph.svg'
import moonIcn from '../assets/icons/moon.svg'
import sunIcn from '../assets/icons/sun.svg'

const SunIcon = () => <img style={{ width: 20, height: 20 }} src={sunIcn} />
const MoonIcon = () => <img style={{ width: 20, height: 20 }} src={moonIcn} />

function NavBar() {
    const navigate = useNavigate()
    const [theme, setTheme] = useState('light')

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

    const handleTheme = () => {
        if (document.body.classList.contains('light')) {
            document.body.classList.remove('light')
            document.body.classList.add('dark')
            setTheme('dark')
        } else {
            document.body.classList.remove('dark')
            document.body.classList.add('light')
            setTheme('light')
        }
    }

    return (
        <div id='navbar-component'>
            <img src={IconImg} alt='icon' />
            <div id='nav-items'>
                <div id='nav-items-left'>
                    <p
                        onClick={() => {
                            navigate('/profile')
                        }}>
                        Profile
                    </p>
                    <p
                        onClick={() => {
                            navigate('/attendance')
                        }}>
                        Attendance
                    </p>
                </div>
                <div id='nav-items-right'>
                    <Button
                        type='text'
                        onClick={handleTheme}
                        icon={theme === 'light' ? <SunIcon /> : <MoonIcon />}>
                        {theme === 'light' ? <p>Light</p> : <p>Dark</p>}
                    </Button>
                    <p onClick={handleLogout}>Logout</p>
                </div>
            </div>
        </div>
    )
}

export default NavBar
