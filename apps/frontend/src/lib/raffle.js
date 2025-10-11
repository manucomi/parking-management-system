import { addMonths } from './date';
import { getState, setAllocations, addRaffle } from './db';

export function runRaffle() {
    const s = getState();
    const participants = s.residents.filter((r) => r.registeredForRaffle);
    const availableSpots = s.spots.filter((sp) => sp.available);

    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const assignments = [];
    let i = 0;
    while (i < shuffled.length && i < availableSpots.length) {
        assignments.push({
            residentId: shuffled[i].id,
            spotId: availableSpots[i].id,
        });
        i++;
    }

    // Build new allocations: overwrite any previous assignment for these residents
    const now = new Date();
    const validUntil = addMonths(now, 12); // one year by default
    const allocations = s.allocations
        .filter(
            (a) => !assignments.find((as) => as.residentId === a.residentId),
        )
        .concat(assignments.map((as) => ({ ...as, validUntil })));

    setAllocations(allocations);

    const raffle = {
        id: `raffle-${now.getTime()}`,
        date: now,
        participants: participants.map((p) => p.id),
        assignments,
    };
    addRaffle(raffle);

    return raffle;
}
