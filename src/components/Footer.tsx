import React from 'react'
import { GithubOutlined, LinkedinOutlined } from '@ant-design/icons'

const Footer = () => {
    return (
        <div className='footer'>
            <div className='footer-left'>&copy; 2023 Xceed</div>
            <div className='footer-right'>
                <a
                    href='https://github.com/ahmedmk11'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <GithubOutlined
                        style={{
                            fontSize: '24px',
                            marginRight: '16px',
                            color: 'rgba(0, 0, 0, 0.8)',
                        }}
                    />
                </a>
                <a
                    href='https://www.linkedin.com/in/ahmed-mahmoud-350b21214/'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <LinkedinOutlined
                        style={{
                            fontSize: '24px',
                            color: 'rgba(0, 0, 0, 0.8)',
                        }}
                    />
                </a>
            </div>
        </div>
    )
}

export default Footer
