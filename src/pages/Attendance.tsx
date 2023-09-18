import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Field from '../components/Field'
import ProfilePicture from '../components/ProfilePicture'

function Attendance() {
    const navigate = useNavigate()

    return (
        <div id='attendance-page'>
            <NavBar />
        </div>
    )
}

export default Attendance
