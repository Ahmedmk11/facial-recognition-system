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

type FieldProps = {
    label: string
    content: string
}

function Field(props: FieldProps) {
    const { label, content } = props
    return (
        <div className='field-component'>
            <p className='field-label'>{label}</p>
            <p className='field-content'>{content}</p>
        </div>
    )
}

Field.propTypes = {
    label: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
}

Field.defaultProps = {
    label: 'Label',
    content: 'Content',
}

export default Field
