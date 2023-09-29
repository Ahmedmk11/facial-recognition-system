import React, { useEffect, useState } from 'react'
import {
    Button,
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
import { checkUserRole } from '../utils/CheckRole'
import { getAllNotifications } from '../utils/GetAllNotifications'
import { dateToString } from '../utils/DateToString'
import { IssuesCloseOutlined } from '@ant-design/icons'

const SunIcon = () => <img style={{ width: 20, height: 20 }} src={sunIcn} />
const MoonIcon = () => <img style={{ width: 20, height: 20 }} src={moonIcn} />

function NavBar() {
    const navigate = useNavigate()
    const page = window.location.pathname.replace('/', '')
    const [theme, setTheme] = useState(
        document.body.classList.contains('light') ? 'light' : 'dark'
    )
    const [role, setRole] = useState<any>(null)
    const [popped, setPopped] = useState<number>(0)
    const [notifs, setNotifs] = useState<MenuProps['items']>([])

    useEffect(() => {
        if (page != 'login' && page != 'register') {
            checkUserRole()
                .then((role) => {
                    setRole(role)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }, [])

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

    const handleDeleteNotification = (e: any, id: number) => {
        const item = e.target.closest('.ant-dropdown-menu-item')
        if (item) {
            item.remove()
            setPopped((prevPopped) => prevPopped + 1)
        }
    }

    useEffect(() => {
        const fetchAdminNotifications = async () => {
            try {
                const notifRes: any = await getAllNotifications()
                console.log(notifRes)
                if (role == 'super') {
                    const notificationData = notifRes.map(
                        (item: any, index: any) => (
                            <div
                                key={`notif_${index}`}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}>
                                <div>
                                    <p>
                                        <span className='not-t'>
                                            Offender ID:{' '}
                                        </span>
                                        <div className='not-cont'>
                                            <span className='not-p'>
                                                {item[1]}{' '}
                                            </span>
                                        </div>
                                        <span className='not-t'>User ID: </span>
                                        <div className='not-cont'>
                                            <span className='not-p'>
                                                {item[2]}
                                            </span>
                                        </div>
                                    </p>
                                    <p>
                                        <span className='not-t'>
                                            Offender Full Name:{' '}
                                        </span>
                                        <div className='not-cont'>
                                            <span className='not-p'>
                                                {item[3]}{' '}
                                            </span>
                                        </div>
                                        <span className='not-t'>
                                            User Full Name:{' '}
                                        </span>
                                        <div className='not-cont'>
                                            <span className='not-p'>
                                                {item[4]}
                                            </span>
                                        </div>
                                    </p>
                                    <p>
                                        <span className='not-t'>
                                            Violation Date:{' '}
                                        </span>
                                        <div className='not-cont'>
                                            <span className='not-p'>
                                                {dateToString(item[5])}
                                            </span>
                                        </div>
                                    </p>
                                </div>
                                <Button
                                    style={{ alignSelf: 'flex-end' }}
                                    type='default'
                                    onClick={(
                                        e: React.MouseEvent<
                                            HTMLElement,
                                            MouseEvent
                                        >
                                    ) => {
                                        handleDeleteNotification(e, item[0])
                                    }}>
                                    Hide
                                </Button>
                            </div>
                        )
                    )
                    setNotifs([
                        {
                            label: (
                                <div key='count'>
                                    <p>
                                        You have {notificationData.length}{' '}
                                        notifications.
                                    </p>
                                </div>
                            ),
                            key: 'n_0',
                        },
                        ...(notificationData.map(
                            (notification: any, index: any) => ({
                                label: (
                                    <div key={`notification_${index + 1}`}>
                                        {notification}
                                    </div>
                                ),
                                key: `notification_${index + 1}`,
                            })
                        ) ?? []),
                    ])
                } else if (role == 'admin') {
                    setNotifs([
                        {
                            label: (
                                <div key='count'>
                                    <p>You have 0 notifications.</p>
                                </div>
                            ),
                            key: 'n_0',
                        },
                    ])
                }
            } catch (error) {
                console.error('Error fetching notifications:', error)
            }
        }

        fetchAdminNotifications()
    }, [role])

    return (
        <div id='navbar-component'>
            <img
                src={IconImg}
                className={theme === 'light' ? 'logo-light' : 'logo-dark'}
                alt='icon'
                onClick={() => {
                    navigate('/home')
                }}
            />
            <div id='nav-items'>
                <div id='nav-items-left'>
                    {role == null ? null : (
                        <>
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
                        </>
                    )}
                </div>
                <div id='nav-items-right'>
                    {role == 'super' || role == 'admin' ? (
                        <Dropdown
                            menu={{ items: notifs }}
                            trigger={['click']}
                            placement='bottomLeft'
                            className='notifs-dropdown'>
                            <a onClick={(e) => e.preventDefault()}>
                                <Space size='middle'>
                                    <Badge
                                        size='default'
                                        count={
                                            notifs
                                                ? notifs.length - 1 - popped
                                                : 0
                                        }
                                        style={
                                            theme === 'light'
                                                ? {
                                                      borderColor: 'white',
                                                  }
                                                : {
                                                      borderColor: 'black',
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
                    ) : null}
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
                        onClick={
                            role == null
                                ? () => {
                                      if (page == 'login') {
                                          navigate('/register')
                                      } else {
                                          navigate('/login')
                                      }
                                  }
                                : handleLogout
                        }>
                        {page == 'login'
                            ? 'Register'
                            : page == 'register'
                            ? 'Login'
                            : 'Logout'}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default NavBar
