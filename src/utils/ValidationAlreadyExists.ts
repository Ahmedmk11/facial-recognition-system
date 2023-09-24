import axios from 'axios'

export const checkEmailInUse = async (rule: any, value: any) => {
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

export const checkUserNameInUse = async (rule: any, value: any) => {
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

export const checkNumberInUse = async (rule: any, value: any) => {
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
                return Promise.reject('Phone number is already in use')
            }
        } catch (error) {
            console.error('Error checking number availability:', error)
            return Promise.reject('Error checking number availability')
        }
    }
    return Promise.resolve()
}
