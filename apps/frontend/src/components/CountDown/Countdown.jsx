import { useEffect, useState } from 'react';
import { daysHoursMinutesUntil } from '@/lib/date';

export default function Countdown({ to }) {
    const [dhm, setDhm] = useState({ days: 0, hours: 0, minutes: 0 });

    useEffect(() => {
        // Initial calculation on client-side only
        setDhm(daysHoursMinutesUntil(to));

        const id = setInterval(
            () => setDhm(daysHoursMinutesUntil(to)),
            1000 * 30,
        );
        return () => clearInterval(id);
    }, [to]);
    return (
        <span>
            {dhm.days}d {dhm.hours}h {dhm.minutes}m
        </span>
    );
}
