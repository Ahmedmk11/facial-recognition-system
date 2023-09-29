import React, { useEffect, useRef, useState } from 'react'
import { Form, Input, Button, DatePicker, message } from 'antd'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import NavBar from '../components/NavBar'
import Webcam from 'react-webcam'
import { captureFramesAndSend } from '../utils/SendVideoFrames'
const { Item } = Form

function Login() {
    const [form] = Form.useForm()
    const webcamRef = useRef(null)
    const [webcamReady, setWebcamReady] = useState(false)
    const [goBack, setGoBack] = useState(false)
    const [isWebcamVisible, setIsWebcamVisible] = useState(false)
    const [un, setUn] = useState('')
    const cleanupFuncRef = useRef<any>(null)

    useEffect(() => {
        const startCapture = () => {
            cleanupFuncRef.current = captureFramesAndSend(un)
        }

        if (webcamReady && location.pathname === '/login' && !goBack) {
            startCapture()
        } else {
            if (cleanupFuncRef.current) {
                cleanupFuncRef.current.stop()
            }
        }

        return () => {
            if (cleanupFuncRef.current) {
                console.log('stop')
                cleanupFuncRef.current.stop()
            }
        }
    }, [webcamReady, location, goBack, un])

    const onFinish = async (values: any) => {
        try {
            setUn(values.username)
            const response = await axios.post(
                'http://127.0.0.1:5000/login',
                values,
                {
                    withCredentials: true,
                }
            )
            console.log('Server response:', response.data)

            if (response.status === 200) {
                form.resetFields()
                setIsWebcamVisible(true)
            }
        } catch (error: any) {
            if (error.response && error.response.status) {
                if (error.response.status === 403) {
                    message.error('Employee account is suspended')
                }
            } else {
                message.error('Login failed')
            }
        }
    }

    const checkUserNameExists = async (rule: any, value: any) => {
        if (value) {
            try {
                const response = await axios.get(
                    'http://127.0.0.1:5000/api/check-username-exists',
                    {
                        params: {
                            username: value,
                        },
                        withCredentials: true,
                    }
                )

                const { username_exists } = response.data

                if (!username_exists) {
                    return Promise.reject('Username does not exist')
                }
            } catch (error) {
                console.error('Error checking username existence:', error)
                return Promise.reject('Error checking username existence')
            }
        }
        return Promise.resolve()
    }

    return (
        <div id='login-page'>
            <NavBar />
            {!isWebcamVisible && (
                <div id='login-form-container'>
                    <Form
                        form={form}
                        name='login'
                        onFinish={onFinish}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}>
                        <h3>Login</h3>
                        <Item
                            label='Username'
                            name='username'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter a username',
                                },
                                { validator: checkUserNameExists },
                            ]}>
                            <Input />
                        </Item>
                        <Button type='primary' htmlType='submit'>
                            Login
                        </Button>
                    </Form>
                </div>
            )}
            {isWebcamVisible && (
                <div id='webcam-container'>
                    <div className='video-container'>
                        <Webcam
                            className='webcam-video'
                            id='videoElement'
                            ref={webcamRef}
                            audio={false}
                            height={480}
                            width={480}
                            mirrored
                            screenshotQuality={1}
                            screenshotFormat='image/jpeg'
                            onUserMedia={() => {
                                setWebcamReady(true)
                                setGoBack(false)
                            }}
                        />
                        <div className='face-overlay'></div>
                    </div>
                    <Button
                        type='primary'
                        onClick={() => {
                            setGoBack(true)
                            setIsWebcamVisible(false)
                        }}>
                        Go Back
                    </Button>
                </div>
            )}
            <Footer />
        </div>
    )
}

export default Login
