import dayjs from 'dayjs'

export function dayJsToString(dateObject: dayjs.Dayjs): string {
    return dateObject.format('MMM D, YYYY')
}
