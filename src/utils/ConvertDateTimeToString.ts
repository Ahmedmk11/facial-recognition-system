export function convertDateFormats(dateString: string): string[] {
    const date = new Date(dateString)
    const dateFormat1 = date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
    const dateFormat2 = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    })
    return [dateFormat1, dateFormat2]
}
