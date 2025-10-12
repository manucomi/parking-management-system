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

/**
 * Execute a raffle by ID or 'current'
 * Used by API route /api/raffles/[id]/execute
 * TODO: Replace with actual Supabase implementation
 */
export async function executeRaffle(raffleId, options = {}) {
    const { sendNotifications = true, algorithm = 'random' } = options;

    // For now, use the existing runRaffle logic
    // In the future, this would:
    // 1. Fetch raffle from database by ID
    // 2. Validate raffle status (not already executed)
    // 3. Run the algorithm (random, weighted, etc.)
    // 4. Update database with results
    // 5. Send notifications if requested

    if (algorithm !== 'random') {
        throw new Error(`Algorithm "${algorithm}" not yet implemented`);
    }

    const raffle = runRaffle();

    // Mock response format
    const winners = raffle.assignments.map((assignment) => {
        const s = getState();
        const resident = s.residents.find(
            (r) => r.id === assignment.residentId,
        );
        const spot = s.spots.find((sp) => sp.id === assignment.spotId);

        return {
            residentId: assignment.residentId,
            resident,
            spotId: assignment.spotId,
            spot,
        };
    });

    return {
        success: true,
        raffleId: raffle.id,
        winners,
        executedAt: raffle.date,
        notificationsSent: sendNotifications,
    };
}
