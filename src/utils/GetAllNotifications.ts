import axios from 'axios'

export const getAllNotifications = () => {
    return new Promise((resolve, reject) => {
        axios
            .get('http://127.0.0.1:5000/api/get-notifications', {
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
