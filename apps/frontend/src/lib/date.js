export function nextQuarterDate(from = new Date()) {
    const month = from.getMonth(); // 0-11
    const nextQuarterStartMonth = [0, 3, 6, 9].find((m) => m > month) ?? 0;
    const year =
        nextQuarterStartMonth === 0 && month > 9
            ? from.getFullYear() + 1
            : from.getFullYear();
    return new Date(year, nextQuarterStartMonth, 1, 9, 0, 0); // 9am
}

export function formatDate(d) {
    if (!d) return '-';
    const date = new Date(d);
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function daysHoursMinutesUntil(target) {
    if (typeof window === 'undefined') {
        return { days: 0, hours: 0, minutes: 0 };
    }
    const now = new Date();
    const diff = new Date(target) - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    return { days, hours, minutes };
}

export function addMonths(date, months) {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
}
