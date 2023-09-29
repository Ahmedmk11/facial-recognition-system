import axios from 'axios'

export const getAllNotificationsForAdmin = (did: number) => {
    return new Promise((resolve, reject) => {
        axios
            .get('http://127.0.0.1:5000/api/get-notifications-admin', {
                params: {
                    did: did,
                },
                withCredentials: true,
            })
            .then((response) => {
                let notifs = response.data.notifs
                console.log('Notifications: ', notifs)
                resolve(notifs)
            })
            .catch((error) => {
                console.log('Cant get notifications ', error)
                reject(null)
            })
    })
}
