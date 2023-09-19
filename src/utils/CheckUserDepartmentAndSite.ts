import axios from 'axios'

export const checkUserDepartmentAndSite = (uid = '') => {
    return new Promise((resolve, reject) => {
        axios
            .get('http://127.0.0.1:5000/api/check-name-site', {
                params: {
                    uid: uid,
                },
                withCredentials: true,
            })
            .then((response) => {
                let nameAndSite = response.data.nameAndSite
                console.log('Name, Site: ', nameAndSite)
                resolve(nameAndSite)
            })
            .catch((error) => {
                console.log("Can't get name and site: ", error)
                resolve(null)
            })
    })
}
