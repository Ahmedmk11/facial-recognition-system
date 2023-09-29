import { Button, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

type NotFoundPageProps = {
    msgTitle: string
    msgContent: string
}

function NotFoundPage(props: NotFoundPageProps) {
    const { msgTitle, msgContent } = props
    const navigate = useNavigate()

    return (
        <div id='notfound-page'>
            <NavBar />
            <div id='notfound-container'>
                <h2>{msgTitle}</h2>
                <p>{msgContent}</p>
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

NotFoundPage.propTypes = {
    msgTitle: PropTypes.string,
    msgContent: PropTypes.string,
}

NotFoundPage.defaultProps = {
    msgTitle: 'Page not found..',
    msgContent: "We're unable to find the page you're looking for.",
}

export default NotFoundPage
