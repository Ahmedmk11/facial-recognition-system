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
    isEdit: boolean
    handle: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function Field(props: FieldProps) {
    const { label, content, isEdit, handle } = props
    return (
        <div className='field-component'>
            <p className='field-label'>{label}</p>
            {isEdit ? (
                <Input
                    type='text'
                    onChange={(e) => {
                        handle(e)
                    }}
                    value={content}
                />
            ) : (
                <p className='field-content'>{content}</p>
            )}
        </div>
    )
}

Field.propTypes = {
    label: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    isEdit: PropTypes.bool.isRequired,
    handle: PropTypes.func.isRequired,
}

Field.defaultProps = {
    label: 'Label',
    content: 'Content',
    isEdit: false,
    handle: () => {},
}

export default Field
