export function date(date: Date, hour: boolean = false, weekday: boolean = true, year: boolean = false)
{
    return capitalize(date.toLocaleDateString(navigator.language, {
        weekday: weekday ? 'long' : undefined,
        day: 'numeric',
        month: 'long',
        hour: hour ? 'numeric' : undefined,
        year: year ? 'numeric' : undefined
    }));
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

export function capitalize(value: string)
{
    let result = '';

    value.split(' ').forEach(word => {
        result += (word.length == 1 ? word : word.charAt(0).toUpperCase() + word.slice(1)) + ' ';
    });

    return result.substring(0, result.length - 1);
}
