import React, { useEffect, useState } from 'react'
import { Form, Input, Button, DatePicker, message, notification } from 'antd'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
    checkEmailInUse,
    checkNumberInUse,
    checkUserNameInUse,
} from '../utils/ValidationAlreadyExists'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import {
    LoadingOutlined,
    SmileOutlined,
    SolutionOutlined,
    UserOutlined,
    CameraOutlined,
    CheckOutlined,
} from '@ant-design/icons'
import { Steps } from 'antd'
import Webcam from 'react-webcam'

const { Item } = Form

function Register() {
    const [form] = Form.useForm()
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(0)
    const [screenshot, setScreenshot] = useState(null)
    const [api, contextHolder] = notification.useNotification()

    const webcamRef = React.useRef(null)

    const openNotification = () => {
        api.open({
            message: 'Face Positioning Reminder',
            description:
                'To achieve the best results, please make sure your face is correctly aligned within the frame.',
            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        })
    }

    useEffect(() => {
        setTimeout(() => {
            openNotification()
        }, 1000)
    }, [])

    const capture = React.useCallback(() => {
        const cam = webcamRef.current as any
        const imageSrc = cam.getScreenshot()
        setScreenshot(imageSrc)
    }, [webcamRef])

    const retake = React.useCallback(() => {
        setScreenshot(null)
    }, [webcamRef])

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    function handleSaveImage(event: any): void {
        if (screenshot) {
            nextStep()
        }
    }

    const onFinish = async (values: any) => {
        form.validateFields()
            .then(async () => {
                values.screenshot = screenshot
                try {
                    const response = await axios.post(
                        'http://127.0.0.1:5000/register',
                        values,
                        {
                            withCredentials: true,
                        }
                    )
                    message.success('Registration successful')
                    form.resetFields()
                    nextStep()
                } catch (error) {
                    message.error('Registration failed')
                }
            })
            .catch((errorInfo) => {})
    }

    const steps = [
        {
            title: 'Photo Capture',
            content: (
                <div id='webcam-container'>
                    {screenshot ? (
                        <div>
                            <img
                                src={screenshot}
                                alt='Captured'
                                width={480}
                                height={480}
                                style={{ objectFit: 'cover' }} // Maintain aspect ratio
                            />
                        </div>
                    ) : (
                        <div className='video-container'>
                            <Webcam
                                className='webcam-video'
                                ref={webcamRef}
                                audio={false}
                                height={480}
                                width={480}
                                mirrored
                                screenshotQuality={1}
                                screenshotFormat='image/jpeg'
                            />
                            <div className='face-overlay'></div>
                        </div>
                    )}
                    <div className='webcam-buttons'>
                        <button
                            type='button'
                            className='btn btn-primary btn-lg float-right custom-button'
                            onClick={screenshot ? retake : capture}>
                            {screenshot ? 'Retake' : 'Capture'}
                        </button>
                        <button
                            disabled={screenshot ? false : true}
                            type='button'
                            className='btn btn-primary btn-lg float-right custom-button'
                            onClick={handleSaveImage}>
                            Next
                        </button>
                    </div>
                </div>
            ),
        },
        {
            title: 'Personal Info',
            content: (
                <div id='register-form-container'>
                    <Form
                        form={form}
                        name='registration'
                        onFinish={onFinish}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}>
                        <h3>Register</h3>
                        <Item
                            label='First Name'
                            name='firstname'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter your first name',
                                },
                                {
                                    min: 2,
                                    message:
                                        'First name should be at least 2 characters long',
                                },
                                {
                                    max: 128,
                                    message:
                                        "First name shouldn't exceed 128 characters",
                                },
                                {
                                    pattern: /^[A-Za-z]+$/,
                                    message:
                                        'First name should only contain letters',
                                },
                            ]}>
                            <Input allowClear />
                        </Item>

                        <Item
                            label='Last Name'
                            name='lastname'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter your last name',
                                },
                                {
                                    min: 2,
                                    message:
                                        'Last name should be at least 2 characters long',
                                },
                                {
                                    max: 128,
                                    message:
                                        "Last name shouldn't exceed 128 characters",
                                },
                                {
                                    pattern: /^[A-Za-z]+$/,
                                    message:
                                        'Last name should only contain letters',
                                },
                            ]}>
                            <Input allowClear />
                        </Item>

                        <Item
                            label='Email'
                            name='email'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter your email',
                                },
                                {
                                    type: 'email',
                                    message: 'Invalid email format',
                                },
                                {
                                    max: 128,
                                    message:
                                        'Email should be a maximum of 128 characters',
                                },
                                { validator: checkEmailInUse },
                            ]}>
                            <Input allowClear />
                        </Item>

                        <Item
                            label='Username'
                            name='username'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter a username',
                                },
                                {
                                    min: 6,
                                    message:
                                        'Username should be at least 6 characters long',
                                },
                                {
                                    max: 64,
                                    message:
                                        "Username shouldn't exceed 64 characters",
                                },
                                {
                                    pattern: /^[A-Za-z0-9_]+$/,
                                    message:
                                        'Username should only contain letters, numbers, and underscores',
                                },
                                { validator: checkUserNameInUse },
                            ]}>
                            <Input allowClear />
                        </Item>

                        <Item
                            label='Street Address'
                            name='street_address'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter your street address',
                                },
                                {
                                    max: 95,
                                    message:
                                        "Street address shouldn't exceed 95 characters",
                                },
                            ]}>
                            <Input allowClear />
                        </Item>

                        <Item
                            label='Location'
                            name='location'
                            rules={[
                                {
                                    required: true,
                                    message:
                                        'Please enter your city and country',
                                },
                                {
                                    max: 255,
                                    message:
                                        "Location shouldn't exceed 255 characters",
                                },
                                {
                                    pattern: /^[A-Za-z, ]{0,255}$/,
                                    message:
                                        'Location should only contain letters and one comma',
                                },
                                {
                                    pattern: /^[^,]+,[^,]+$/,
                                    message:
                                        'Please match the requested format (e.g. Cairo, Egypt)',
                                },
                            ]}>
                            <Input allowClear />
                        </Item>

                        <Item
                            label='Phone Number'
                            name='phone_number'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter your phone number',
                                },
                                {
                                    max: 15,
                                    message:
                                        'Phone number should be a maximum of 15 characters',
                                },
                                {
                                    pattern: /^[0-9()+\-]+$/,
                                    message:
                                        'Phone number should only contain numbers, (, ), +, -',
                                },
                                { validator: checkNumberInUse },
                            ]}>
                            <Input allowClear />
                        </Item>

                        <Item
                            label='Birthdate'
                            name='birthdate'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select your birthdate',
                                },
                            ]}>
                            <DatePicker allowClear />
                        </Item>

                        <Button type='primary' htmlType='submit'>
                            Register
                        </Button>
                    </Form>
                </div>
            ),
        },
        {
            title: 'Done',
            content: (
                <div id='registered-container'>
                    <button
                        type='button'
                        className='btn btn-primary btn-lg float-right custom-button'
                        onClick={() => {
                            navigate('/login')
                        }}>
                        Home
                    </button>
                </div>
            ),
        },
    ]

    return (
        <div id='register-page'>
            <NavBar />
            <div id='register-content-c'>
                <Steps
                    style={{ width: 550 }}
                    current={currentStep - 1} // Ant Design Steps use 0-based indexing
                    items={steps.map((step, index) => ({
                        title: step.title,
                        status:
                            currentStep > index
                                ? 'finish'
                                : currentStep === index
                                ? 'process'
                                : 'wait',
                        icon:
                            currentStep > index ? (
                                step.title == 'Photo Capture' ? (
                                    <CameraOutlined />
                                ) : step.title == 'Personal Info' ? (
                                    <UserOutlined />
                                ) : step.title == 'Done' ? (
                                    <SmileOutlined />
                                ) : null
                            ) : currentStep === index ? (
                                step.title == 'Done' ? (
                                    <CheckOutlined />
                                ) : (
                                    <LoadingOutlined />
                                )
                            ) : null,
                    }))}
                />
                {steps[currentStep].content}
            </div>
            <Footer />
            {contextHolder}
        </div>
    )
}

export default Register
