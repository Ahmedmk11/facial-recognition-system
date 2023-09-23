import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input,
    Button,
    DatePicker,
    message,
    Dropdown,
    Space,
    Badge,
    MenuProps,
    Divider,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { UserOutlined } from '@ant-design/icons'

import cameraIcn from '../assets/icons/camera.svg'

type ProfilePictureProps = {
    id: any
}

function ProfilePicture(props: ProfilePictureProps) {
    const { id } = props
    return (
        <div id='profile-picture-component'>
            <img
                id='camera'
                src={cameraIcn}
                alt='camera icon for adding a new pp'
            />
            <UserOutlined />
            <div id='pp-bottom'>
                <p>ID: {id}</p>
            </div>
        </div>
    )
}

ProfilePicture.propTypes = {}

ProfilePicture.defaultProps = {}

export default ProfilePicture
