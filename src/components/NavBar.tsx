import React, { useEffect, useState } from 'react'
import {
    Form,
    Input,
    Button,
    DatePicker,
    message,
    Dropdown,
    Space,
    Badge,
    MenuProps,
    Divider,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import IconImg from '../assets/images/logo.svg'
import moonIcn from '../assets/icons/moon.svg'
import sunIcn from '../assets/icons/sun.svg'
import notificationsIcn from '../assets/icons/notifications.svg'

const SunIcon = () => <img style={{ width: 20, height: 20 }} src={sunIcn} />
const MoonIcon = () => <img style={{ width: 20, height: 20 }} src={moonIcn} />

function NavBar() {
    const navigate = useNavigate()
    const page = window.location.pathname.replace('/', '')
    const [theme, setTheme] = useState(
        document.body.classList.contains('light') ? 'light' : 'dark'
    )

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

    const getAdminNotifications = () => {
        return []
    }

    const notifs: MenuProps['items'] = [
        {
            label: (
                <>
                    <p id='notifs-p'>
                        You have {getAdminNotifications()?.length ?? 0}{' '}
                        notifications.{' '}
                    </p>
                    <Divider style={{ margin: '0' }} />
                </>
            ),
            key: 'tasksDue',
        },
    ]

    return (
        <div id='navbar-component'>
            <img
                src={IconImg}
                className={theme === 'light' ? 'logo-light' : 'logo-dark'}
                alt='icon'
            />
            <div id='nav-items'>
                <div id='nav-items-left'>
                    <p
                        className={
                            page === 'home'
                                ? 'underlined-item'
                                : 'hover-underline-animation'
                        }
                        onClick={() => {
                            navigate('/home')
                        }}>
                        Home
                    </p>
                    <p
                        className={
                            page === 'profile'
                                ? 'underlined-item'
                                : 'hover-underline-animation'
                        }
                        onClick={() => {
                            navigate('/profile')
                        }}>
                        Profile
                    </p>
                    <p
                        className={
                            page === 'attendance'
                                ? 'underlined-item'
                                : 'hover-underline-animation'
                        }
                        onClick={() => {
                            navigate('/attendance')
                        }}>
                        Attendance
                    </p>
                </div>
                <div id='nav-items-right'>
                    <Dropdown
                        menu={{ items: notifs }}
                        trigger={['click']}
                        placement='bottomLeft'
                        className='notifs-dropdown'>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space size='middle'>
                                <Badge
                                    count={getAdminNotifications().length + 1}
                                    style={
                                        theme === 'light'
                                            ? {
                                                  borderColor: 'white',
                                                  minWidth: '18px',
                                                  height: '18px',
                                              }
                                            : {
                                                  borderColor: 'black',
                                                  minWidth: '18px',
                                                  height: '18px',
                                              }
                                    }>
                                    <img
                                        id='notification-img'
                                        src={notificationsIcn}
                                        alt='Icon for notificatons'
                                        className={
                                            theme === 'light'
                                                ? 'notifs-light'
                                                : 'notifs-dark'
                                        }
                                    />
                                </Badge>
                            </Space>
                        </a>
                    </Dropdown>
                    <Button
                        type='text'
                        onClick={handleTheme}
                        icon={theme === 'light' ? <SunIcon /> : <MoonIcon />}>
                        {theme === 'light' ? <p>Light</p> : <p>Dark</p>}
                    </Button>
                    <p
                        className={
                            page === 'logout'
                                ? 'underlined-item'
                                : 'hover-underline-animation'
                        }
                        onClick={handleLogout}>
                        Logout
                    </p>
                </div>
            </div>
        </div>
    )
}

export default NavBar
