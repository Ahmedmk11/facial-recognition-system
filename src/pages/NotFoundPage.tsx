import { Button, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

function NotFoundPage() {
    const navigate = useNavigate()

    return (
        <div id='notfound-page'>
            <NavBar />
            <div id='notfound-container'>
                <h2>Page not found..</h2>
                <p>We're unable to find the page you're looking for.</p>
                <Space wrap>
                    <button
                        className='btn btn-primary btn-lg float-right custom-button'
                        style={{
                            fontSize: 15,
                        }}
                        onClick={() => {
                            navigate('/home')
                        }}>
                        Return to home
                    </button>
                </Space>
            </div>
            <Footer />
        </div>
    )
}

export default NotFoundPage
