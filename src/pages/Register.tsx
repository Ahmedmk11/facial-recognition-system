import React from 'react'
import { Form, Input, Button, DatePicker, message } from 'antd'
import axios from 'axios'
const { Item } = Form

function Register() {
    const [form] = Form.useForm()

    const onFinish = async (values: any) => {
        try {
            const response = await axios.post(
                'http://127.0.0.1:5000/register',
                values
            )
            // Handle the response from the server (e.g., display success or error message)
            console.log('Server response:', response.data)
            message.success('Registration successful')
            form.resetFields()
        } catch (error) {
            // Handle any errors that occur during the POST request
            console.error('Error:', error)
            message.error('Registration failed')
        }
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
                        { type: 'email', message: 'Invalid email format' },
                    ]}
                >
                    <Input />
                </Item>

                <Item
                    label='Username'
                    name='username'
                    rules={[
                        { required: true, message: 'Please enter a username' },
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
                        {
                            pattern: /^[0-9]+$/,
                            message: 'Phone number must contain only digits',
                        },
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
