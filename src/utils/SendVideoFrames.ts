import { message } from 'antd'
import axios from 'axios'

let cancelTokenSources: any = []

export const captureFramesAndSend = (un: string) => {
    let intervalId = null as any

    const videoElement = document.getElementById(
        'videoElement'
    ) as HTMLVideoElement
    console.log(videoElement)
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d') as any
    canvas.width = 480
    canvas.height = 480

    const captureAndSendFrame = () => {
        let source = axios.CancelToken.source()
        cancelTokenSources.push(source)
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
                    cancelToken: source.token, // Pass the cancel token to the request
                }
            )
            .then((response) => {
                if (response.status === 200) {
                    if (
                        document.getElementsByClassName('ant-message-notice')
                            .length === 0
                    ) {
                        message.success('Login successful')
                    }
                    stopCapture()
                    setTimeout(() => {
                        window.location.href = '/home'
                    }, 1000)
                }
            })
            .catch((error) => {
                if (axios.isCancel(error)) {
                    console.log('Request cancelled')
                } else {
                    if (error.response && error.response.status) {
                        if (
                            document.getElementsByClassName(
                                'ant-message-notice'
                            ).length === 0
                        ) {
                            const statusCode = error.response.status

                            if (statusCode === 403) {
                                if (error.response.data.message == 0) {
                                    message.error(
                                        'Please ensure your face is well-centered within the frame for accurate recognition.',
                                        1
                                    )
                                } else if (error.response.data.message > 1) {
                                    message.error(
                                        'Please ensure that you are the only person in the frame.',
                                        1
                                    )
                                } else {
                                    if (error.response.data.violation) {
                                        const vname = error.response.data.vname
                                        message.error(
                                            `Hello, ${vname}. Using a different username to login isn't allowed.`,
                                            1
                                        )
                                    }
                                }
                            } else if (statusCode === 500) {
                                message.error(
                                    'Login Failed, Cannot insert attendance',
                                    1
                                )
                            } else if (statusCode === 418) {
                                message.error(
                                    `Face not centered correctly. Is ${un} your correct username?`,
                                    1
                                )
                            } else {
                                console.log(`Error status code: ${statusCode}`)
                            }
                        }
                    } else {
                        if (
                            document.getElementsByClassName(
                                'ant-message-notice'
                            ).length === 0
                        ) {
                            message.error(
                                `Face not recognized. Is ${un} your correct username?`,
                                1
                            )
                        }
                    }
                }
            })
    }

    const startCapture = () => {
        intervalId = setInterval(captureAndSendFrame, 1000)
    }

    const stopCapture = () => {
        clearInterval(intervalId)
        cancelTokenSources.forEach((source: any) => source.cancel())
        // Clear the array of CancelToken sources
        cancelTokenSources = []
    }
    startCapture()

    return {
        stop: stopCapture,
    }
}
