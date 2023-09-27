import { message } from 'antd'
import axios from 'axios'

export const captureFramesAndSend = (un: string) => {
    let intervalId = null as any

    const videoElement = document.getElementById(
        'videoElement'
    ) as HTMLVideoElement
    console.log(videoElement)
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d') as any
    canvas.width = 638.66
    canvas.height = 480

    const captureAndSendFrame = () => {
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
        const frameData = canvas.toDataURL('image/jpeg', 1.0)
        axios
            .post(
                'http://127.0.0.1:5000/api/facial-recognition',
                {
                    un,
                    frameData,
                },
                {
                    withCredentials: true,
                }
            )
            .then((response) => {
                message.success('Login successful')
                setTimeout(() => {
                    window.location.href = '/home'
                }, 1000)
            })
            .catch((error) => {
                message.error('Login failed')
            })
    }

    const startCapture = () => {
        intervalId = setInterval(captureAndSendFrame, 1000)
    }

    const stopCapture = () => {
        clearInterval(intervalId)
    }
    startCapture()

    return {
        stop: stopCapture,
    }
}
