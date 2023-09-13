import React, { useState } from 'react'
import { Form, Input, Button, DatePicker, message } from 'antd'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const { Item } = Form

function Register() {
    const [form] = Form.useForm()
    const navigate = useNavigate()

    const onFinish = async (values: any) => {
        try {
            const response = await axios.post(
                'http://127.0.0.1:5000/register',
                values,
                {
                    withCredentials: true,
                }
            )
            // Handle the response from the server (e.g., display success or error message)
            console.log('Server response:', response.data)
            message.success('Registration successful')
            form.resetFields()
            navigate('/home')
        } catch (error) {
            // Handle any errors that occur during the POST request
            console.error('Error:', error)
            message.error('Registration failed')
        }
    }

    const checkEmailInUse = async (rule: any, value: any) => {
        if (value) {
            try {
                const response = await axios.get(
                    'http://127.0.0.1:5000/api/check-email',
                    {
                        params: {
                            email: value,
                        },
                        withCredentials: true,
                    }
                )

                const { emailInUse } = response.data

                if (emailInUse) {
                    return Promise.reject('Email is already in use')
                }
            } catch (error) {
                console.error('Error checking email availability:', error)
                return Promise.reject('Error checking email availability')
            }
        }
        return Promise.resolve()
    }

    const checkUserNameInUse = async (rule: any, value: any) => {
        if (value) {
            try {
                const response = await axios.get(
                    'http://127.0.0.1:5000/api/check-username',
                    {
                        params: {
                            username: value,
                        },
                        withCredentials: true,
                    }
                )

                const { usernameInUse } = response.data

                if (usernameInUse) {
                    return Promise.reject('Username is taken')
                }
            } catch (error) {
                console.error('Error checking username availability:', error)
                return Promise.reject('Error checking username availability')
            }
        }
        return Promise.resolve()
    }

    const checkNumberInUse = async (rule: any, value: any) => {
        if (value) {
            try {
                const response = await axios.get(
                    'http://127.0.0.1:5000/api/check-number',
                    {
                        params: {
                            number: value,
                        },
                        withCredentials: true,
                    }
                )

                const { numberInUse } = response.data

                if (numberInUse) {
                    return Promise.reject('Phone Number is already in use')
                }
            } catch (error) {
                console.error('Error checking number availability:', error)
                return Promise.reject('Error checking number availability')
            }
        }
        return Promise.resolve()
    }

    return (
        <div id='register-page'>
            <Form
                form={form}
                name='registration'
                onFinish={onFinish}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
            >
                <Item
                    label='First Name'
                    name='firstname'
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your first name',
                        },
                    ]}
                >
                    <Input />
                </Item>

                <Item
                    label='Last Name'
                    name='lastname'
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your last name',
                        },
                    ]}
                >
                    <Input />
                </Item>

                <Item
                    label='Email'
                    name='email'
                    rules={[
                        { required: true, message: 'Please enter your email' },
                        {
                            type: 'email',
                            message: 'Invalid email format',
                        },
                        { validator: checkEmailInUse },
                    ]}
                >
                    <Input />
                </Item>

                <Item
                    label='Username'
                    name='username'
                    rules={[
                        { required: true, message: 'Please enter a username' },
                        { validator: checkUserNameInUse },
                    ]}
                >
                    <Input />
                </Item>

                <Item
                    label='Street Address'
                    name='street_address'
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your street address',
                        },
                    ]}
                >
                    <Input />
                </Item>

                <Item
                    label='City'
                    name='city'
                    rules={[
                        { required: true, message: 'Please enter your city' },
                    ]}
                >
                    <Input />
                </Item>

                <Item
                    label='Country'
                    name='country'
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your country',
                        },
                    ]}
                >
                    <Input />
                </Item>

                <Item
                    label='Phone Number'
                    name='phone_number'
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your phone number',
                        },
                        { validator: checkNumberInUse },
                    ]}
                >
                    <Input />
                </Item>

                <Item
                    label='Birthdate'
                    name='birthdate'
                    rules={[
                        {
                            required: true,
                            message: 'Please select your birthdate',
                        },
                    ]}
                >
                    <DatePicker />
                </Item>

                <Item wrapperCol={{ offset: 6, span: 18 }}>
                    <Button type='primary' htmlType='submit'>
                        Register
                    </Button>
                </Item>
            </Form>
        </div>
    )
}

export default Register
