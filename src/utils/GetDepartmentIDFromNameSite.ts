import axios from 'axios'

export const getDepartmentID = (name: string, site: string) => {
    return new Promise((resolve, reject) => {
        axios
            .get('http://127.0.0.1:5000/api/get-dep-id', {
                params: {
                    name: name,
                    site: site,
                },
                withCredentials: true,
            })
            .then((response) => {
                let did = response.data.did
                resolve(did)
            })
            .catch((error) => {
                console.log("Can't get department: ", error)
                reject(error)
            })
    })
}
