import axios from 'axios'

export async function downloadExcel(data: any) {
    try {
        const response = await axios.get(
            'http://127.0.0.1:5000/api/generate-excel',
            {
                responseType: 'blob',
                params: {
                    data: JSON.stringify(data),
                },
                withCredentials: true,
            }
        )

        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'AttendanceReport.xlsx'
        a.click()

        window.URL.revokeObjectURL(url)
    } catch (error) {
        console.error('Error downloading Excel file:', error)
    }
}
