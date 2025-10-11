const KEY = 'pms-db-v1';

const defaultState = {
    currentUser: null, // { role: 'resident'|'admin', email, name, id }
    residents: [], // { id, name, email, registeredForRaffle: boolean }
    spots: [
        { id: 'A-01', building: 'A', level: 1, available: true },
        { id: 'A-02', building: 'A', level: 1, available: true },
        { id: 'B-01', building: 'B', level: 1, available: true },
        { id: 'B-02', building: 'B', level: 1, available: true },
    ],
    allocations: [], // { residentId, spotId, validUntil }
    raffles: [], // { id, date, participants: [residentId], assignments: [{residentId, spotId}] }
    nextRaffleAt: null,
};

function load() {
    if (typeof window === 'undefined') return { ...defaultState };
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...defaultState };
    try {
        return JSON.parse(raw);
    } catch {
        return { ...defaultState };
    }
}

function save(state) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEY, JSON.stringify(state));
}

export function getState() {
    return load();
}
export function setState(updater) {
    const state = load();
    const next = typeof updater === 'function' ? updater(state) : updater;
    save(next);
    return next;
}

export function login({ role, email, name }) {
    return setState((s) => ({
        ...s,
        currentUser: {
            id: email,
            role,
            email,
            name: name || email.split('@')[0],
        },
    }));
}
export function logout() {
    return setState((s) => ({ ...s, currentUser: null }));
}

export function upsertResident(resident) {
    return setState((s) => {
        const idx = s.residents.findIndex((r) => r.id === resident.id);
        const residents = [...s.residents];
        if (idx >= 0) residents[idx] = { ...residents[idx], ...resident };
        else residents.push(resident);
        return { ...s, residents };
    });
}

export function removeResident(id) {
    return setState((s) => ({
        ...s,
        residents: s.residents.filter((r) => r.id !== id),
        allocations: s.allocations.filter((a) => a.residentId !== id),
    }));
}

export function listResidents() {
    return getState().residents;
}

export function listSpots() {
    return getState().spots;
}
export function upsertSpot(spot) {
    return setState((s) => {
        const idx = s.spots.findIndex((sp) => sp.id === spot.id);
        const spots = [...s.spots];
        if (idx >= 0) spots[idx] = { ...spots[idx], ...spot };
        else spots.push(spot);
        return { ...s, spots };
    });
}
export function removeSpot(id) {
    return setState((s) => ({
        ...s,
        spots: s.spots.filter((sp) => sp.id !== id),
        allocations: s.allocations.filter((a) => a.spotId !== id),
    }));
}

export function getAllocations() {
    return getState().allocations;
}
export function setAllocations(allocations) {
    return setState((s) => ({ ...s, allocations }));
}

export function setNextRaffleAt(date) {
    return setState((s) => ({ ...s, nextRaffleAt: date }));
}
export function getNextRaffleAt() {
    return getState().nextRaffleAt;
}

export function addRaffle(r) {
    return setState((s) => ({ ...s, raffles: [...s.raffles, r] }));
}
export function listRaffles() {
    return getState().raffles;
}
