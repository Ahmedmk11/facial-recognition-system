import dayjs from 'dayjs'

export function stringToDayJs(dateString: string): dayjs.Dayjs | null {
    dateString = dateString.trim()
    const dateComponents = dateString.split(' ')

    if (dateComponents.length !== 3) {
        return null
    }

    const month = dateComponents[0]
    const day = parseInt(dateComponents[1])
    const year = parseInt(dateComponents[2])

    const dateObject = dayjs(`${year}-${month}-${day}`, {
        format: 'YYYY-MMM-D',
    })

    if (dateObject.isValid()) {
        return dateObject
    } else {
        return null
    }
}
