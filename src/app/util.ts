export function date(date: Date, hour: boolean = false, weekday: boolean = true, year: boolean = false, small: boolean = false)
{
    return capitalize(date.toLocaleDateString(navigator.language, {
        weekday: weekday ? 'long' : undefined,
        day: 'numeric',
        month: 'long',
        hour: hour ? 'numeric' : undefined,
        year: year ? 'numeric' : undefined
    }), small);
}

export function rangeHour(from: Date, to: Date)
{
    return 'de ' + parseHour(from) + ' à ' + parseHour(to);
}

export function parseHour(date: Date)
{
    let result = pad(date.getHours()) + 'h';
    if (date.getMinutes() !== 0)
    {
        result += pad(date.getMinutes());
    }

    return result;
}

export function pad(value: number)
{
    let result = value.toString();
    if (result.length == 1)
    {
        result = '0' + result;
    }

    return result;
}

export function capitalize(value: string, small: boolean)
{
    let result = '';

    value.split(' ').forEach(word => {
        let a = word.length == 1 ? word : word.charAt(0).toUpperCase() + word.slice(1);
        if (small && a.length > 3) {
            a = a.substr(0, 3) + '.';
        }

        result += a + ' ';
    });

    return result.substring(0, result.length - 1);
}
