import { Button, Dropdown } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { checkUserRole } from '../utils/CheckRole'
import { Select } from 'antd'

function Profile() {
    const navigate = useNavigate()
    const [role, setRole] = useState<any>(null)
    const [selectedOptions, setSelectedOptions] = useState<any>([])

    const { Option } = Select

    const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
    ]

    const handleOptionSelect = (selectedValues: any) => {
        if (selectedValues.includes('selectAll')) {
            if (options.length === selectedOptions.length) {
                setSelectedOptions([])
            } else {
                setSelectedOptions(options.map((option) => option.value))
            }
        } else {
            setSelectedOptions(selectedValues)
        }
    }

    useEffect(() => {
        checkUserRole()
            .then((role) => {
                setRole(role)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    return (
        <div id='profile-page'>
            <NavBar />
            <div id='profile-page-content'>
                {role === 'employee' ? null : (
                    <Select
                        mode='multiple'
                        style={{ width: '100%' }}
                        placeholder='Select options'
                        value={selectedOptions}
                        onChange={handleOptionSelect}>
                        <Option value='selectAll'>Select All</Option>
                        {options.map((option) => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                )}
            </div>
        </div>
    )
}

export default Profile
