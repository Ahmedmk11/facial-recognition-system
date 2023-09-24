import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

function Attendance() {
    const navigate = useNavigate()

    return (
        <div id='attendance-page'>
            <NavBar />
            <div id='attendance-container'></div>
            <Footer />
        </div>
    )
}

export default Attendance
