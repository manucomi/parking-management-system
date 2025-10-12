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

// ============================================================================
// API Route Stub Functions (Backend Integration Layer)
// These functions will be replaced with actual Supabase/Backend calls
// ============================================================================

/**
 * Get all residents with pagination and filters
 * TODO: Replace with Supabase query when backend is integrated
 */
export async function getAllResidents(params = {}) {
    const { page = 1, limit = 10, search, building, hasParking } = params;
    const state = getState();
    let filtered = [...state.residents];

    // Apply filters
    if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(
            (r) =>
                r.name?.toLowerCase().includes(searchLower) ||
                r.email?.toLowerCase().includes(searchLower),
        );
    }
    if (building) {
        filtered = filtered.filter((r) => r.building === building);
    }
    if (hasParking !== undefined) {
        const hasAllocation = (residentId) =>
            state.allocations.some((a) => a.residentId === residentId);
        filtered = filtered.filter((r) => hasAllocation(r.id) === hasParking);
    }

    // Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const residents = filtered.slice(start, start + limit);

    return {
        residents,
        total,
        page,
        totalPages,
    };
}

/**
 * Get resident by ID
 * TODO: Replace with Supabase query when backend is integrated
 */
export async function getResidentById(id) {
    const state = getState();
    const resident = state.residents.find((r) => r.id === id);

    if (!resident) return null;

    // Include parking allocation if exists
    const allocation = state.allocations.find((a) => a.residentId === id);
    const spot = allocation
        ? state.spots.find((s) => s.id === allocation.spotId)
        : null;

    return {
        ...resident,
        parkingAllocation: allocation
            ? {
                  spotId: allocation.spotId,
                  spot,
                  validUntil: allocation.validUntil,
              }
            : null,
    };
}

/**
 * Update resident
 * TODO: Replace with Supabase mutation when backend is integrated
 */
export async function updateResident(id, data, options = {}) {
    const state = getState();
    const resident = state.residents.find((r) => r.id === id);

    if (!resident) return null;

    const updated = options.partial
        ? { ...resident, ...data }
        : { ...data, id };

    upsertResident(updated);
    return updated;
}

/**
 * Delete resident
 * TODO: Replace with Supabase mutation when backend is integrated
 */
export async function deleteResident(id) {
    const state = getState();
    const resident = state.residents.find((r) => r.id === id);

    if (!resident) return null;

    removeResident(id);
    return { success: true, id };
}

/**
 * Get parking history for resident
 * TODO: Replace with Supabase query when backend is integrated
 */
export async function getResidentParkingHistory(id) {
    const state = getState();
    const resident = state.residents.find((r) => r.id === id);

    if (!resident) return null;

    // For now, return current allocation as single history item
    const allocation = state.allocations.find((a) => a.residentId === id);
    if (!allocation) return [];

    const spot = state.spots.find((s) => s.id === allocation.spotId);

    return [
        {
            id: `${id}-${allocation.spotId}`,
            residentId: id,
            spotId: allocation.spotId,
            spot,
            startDate: new Date().toISOString(),
            endDate: allocation.validUntil,
            status: 'active',
        },
    ];
}

/**
 * Register resident for raffle
 * TODO: Replace with Supabase mutation when backend is integrated
 */
export async function registerResidentForRaffle(id, data = {}) {
    const state = getState();
    const resident = state.residents.find((r) => r.id === id);

    if (!resident) return null;

    // Check if already registered
    if (resident.registeredForRaffle) {
        throw new Error('Resident already registered for raffle');
    }

    // Check eligibility (e.g., no current parking allocation)
    const hasAllocation = state.allocations.some((a) => a.residentId === id);
    if (hasAllocation) {
        throw new Error('Resident not eligible - already has parking spot');
    }

    const updated = { ...resident, registeredForRaffle: true };
    upsertResident(updated);

    return {
        success: true,
        message: 'Successfully registered for raffle',
        resident: updated,
    };
}

/**
 * Unregister resident from raffle
 * TODO: Replace with Supabase mutation when backend is integrated
 */
export async function unregisterResidentFromRaffle(id) {
    const state = getState();
    const resident = state.residents.find((r) => r.id === id);

    if (!resident || !resident.registeredForRaffle) return null;

    const updated = { ...resident, registeredForRaffle: false };
    upsertResident(updated);

    return { success: true };
}

/**
 * Get all raffles
 * TODO: Replace with Supabase query when backend is integrated
 */
export async function getAllRaffles(params = {}) {
    const { page = 1, limit = 10, status } = params;
    const state = getState();
    let filtered = [...state.raffles];

    // Apply status filter
    if (status) {
        filtered = filtered.filter((r) => r.status === status);
    }

    // Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const raffles = filtered.slice(start, start + limit);

    return {
        raffles,
        total,
        page,
        totalPages,
    };
}

/**
 * Get current active raffle
 * TODO: Replace with Supabase query when backend is integrated
 */
export async function getCurrentRaffle() {
    const state = getState();
    const currentRaffle = state.raffles.find((r) => r.status === 'active');
    return currentRaffle || null;
}

/**
 * Get all parking spots
 * TODO: Replace with Supabase query when backend is integrated
 */
export async function getAllParkingSpots(params = {}) {
    const { page = 1, limit = 10, building, level, status, type } = params;
    const state = getState();
    let filtered = [...state.spots];

    // Apply filters
    if (building) {
        filtered = filtered.filter((s) => s.building === building);
    }
    if (level) {
        filtered = filtered.filter((s) => s.level === parseInt(level, 10));
    }
    if (status) {
        const isAvailable = status === 'available';
        filtered = filtered.filter((s) => s.available === isAvailable);
    }
    if (type) {
        filtered = filtered.filter((s) => s.type === type);
    }

    // Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const spots = filtered.slice(start, start + limit);

    return {
        spots,
        total,
        page,
        totalPages,
    };
}

/**
 * Assign parking spot to resident
 * TODO: Replace with Supabase mutation when backend is integrated
 */
export async function assignParkingSpot(spotId, data) {
    const state = getState();
    const spot = state.spots.find((s) => s.id === spotId);

    if (!spot) return null;
    if (!spot.available) {
        throw new Error('Parking spot already assigned');
    }

    const { residentId, startDate, endDate, notes } = data;

    // Update spot availability
    upsertSpot({ ...spot, available: false });

    // Create allocation
    const allocation = {
        id: `${residentId}-${spotId}`,
        residentId,
        spotId,
        startDate,
        validUntil: endDate,
        notes,
        createdAt: new Date().toISOString(),
    };

    setState((s) => ({
        ...s,
        allocations: [...s.allocations, allocation],
    }));

    return {
        success: true,
        allocation,
    };
}

/**
 * Release parking spot
 * TODO: Replace with Supabase mutation when backend is integrated
 */
export async function releaseParkingSpot(spotId, data = {}) {
    const state = getState();
    const spot = state.spots.find((s) => s.id === spotId);

    if (!spot) return null;

    const allocation = state.allocations.find((a) => a.spotId === spotId);
    if (!allocation) {
        throw new Error('Parking spot is not assigned');
    }

    // Update spot availability
    upsertSpot({ ...spot, available: true });

    // Remove allocation
    setState((s) => ({
        ...s,
        allocations: s.allocations.filter((a) => a.spotId !== spotId),
    }));

    return { success: true };
}
