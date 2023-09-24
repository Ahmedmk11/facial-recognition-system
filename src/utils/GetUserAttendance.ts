import axios from 'axios'

export const getUserAttendance = (uid: string) => {
    return new Promise((resolve, reject) => {
        axios
            .get('http://127.0.0.1:5000/api/get-user-attendance', {
                params: {
                    uid: uid,
                },
                withCredentials: true,
            })
            .then((response) => {
                let attendance = response.data.attendance
                resolve(attendance)
            })
            .catch((error) => {
                console.log("Can't get attendance: ", error)
                reject(error)
            })
    })
}
