import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'

function Home() {
    const navigate = useNavigate()

    return (
        <div id='home-page'>
            <NavBar />
        </div>
    )
}

export default Home
