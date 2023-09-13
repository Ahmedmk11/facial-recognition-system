import React, { useEffect, useState } from 'react'
import { Form, Input, Button, DatePicker, message } from 'antd'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const { Item } = Form

function Login() {
    const [form] = Form.useForm()
    const navigate = useNavigate()

    const onFinish = async (values: any) => {
        try {
            const response = await axios.post(
                'http://127.0.0.1:5000/login',
                values,
                {
                    withCredentials: true,
                }
            )
            console.log('Server response:', response.data)

            if (response.status === 200) {
                message.success('Login successful')
                form.resetFields()
                navigate('/home')
            } else {
                message.error('Login failed')
            }
        } catch (error) {
            console.error('Error:', error)
            message.error('Login failed')
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
            <Form
                form={form}
                name='login'
                onFinish={onFinish}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
            >
                <Item
                    label='Username'
                    name='username'
                    rules={[
                        { required: true, message: 'Please enter a username' },
                        { validator: checkUserNameExists },
                    ]}
                >
                    <Input />
                </Item>
                <Item wrapperCol={{ offset: 6, span: 18 }}>
                    <Button type='primary' htmlType='submit'>
                        Login
                    </Button>
                </Item>
            </Form>
        </div>
    )
}

export default Login