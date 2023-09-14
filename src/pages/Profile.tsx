import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'

function Profile() {
    const navigate = useNavigate()

    return (
        <div id='profile-page'>
            <NavBar />
            <div id='profile-page-content'></div>
        </div>
    )
}

export default Profile
