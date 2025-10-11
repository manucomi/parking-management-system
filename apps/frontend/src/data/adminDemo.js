export const kpis = [
    { label: 'Total Residents', value: 156, trend: 'up', changePct: 3 },
    { label: 'Total Parking Spots', value: 120, trend: 'flat', changePct: 0 },
    { label: 'Unassigned Spots', value: 18, trend: 'down', changePct: 2 },
    { label: 'Raffle Registrations', value: 45, trend: 'up', changePct: 12 },
];

export const nextRaffle = {
    date: 'November 5, 2025',
    registeredCount: 45,
    daysRemaining: 31,
};

export const recentAllocations = [
    {
        resident: 'John Smith',
        spotId: '12',
        building: 'Building A',
        date: '2023-05-15',
    },
    {
        resident: 'Sarah Johnson',
        spotId: '8',
        building: 'Building B',
        date: '2023-05-15',
    },
    {
        resident: 'Michael Brown',
        spotId: '24',
        building: 'Building A',
        date: '2023-05-15',
    },
    {
        resident: 'Emily Davis',
        spotId: '5',
        building: 'Building C',
        date: '2023-05-15',
    },
];

export const unassignedSpots = [
    { spotId: '15', building: 'Building A', level: 2, status: 'Unassigned' },
    { spotId: '22', building: 'Building A', level: 3, status: 'Unassigned' },
    { spotId: '9', building: 'Building B', level: 1, status: 'Unassigned' },
];

export const residents = [
    {
        name: 'John Smith',
        email: 'john.smith@example.com',
        building: 'Building A',
        apartment: '101',
        status: 'Assigned',
    },
    {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        building: 'Building B',
        apartment: '205',
        status: 'Assigned',
    },
    {
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        building: 'Building A',
        apartment: '310',
        status: 'Assigned',
    },
    {
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        building: 'Building C',
        apartment: '112',
        status: 'No Spot',
    },
    {
        name: 'David Wilson',
        email: 'david.wilson@example.com',
        building: 'Building B',
        apartment: '402',
        status: 'No Spot',
    },
    {
        name: 'Jennifer Martinez',
        email: 'jennifer.martinez@example.com',
        building: 'Building A',
        apartment: '215',
        status: 'No Spot',
    },
    {
        name: 'Robert Taylor',
        email: 'robert.taylor@example.com',
        building: 'Building C',
        apartment: '308',
        status: 'Assigned',
    },
    {
        name: 'Lisa Anderson',
        email: 'lisa.anderson@example.com',
        building: 'Building B',
        apartment: '117',
        status: 'No Spot',
    },
];

export const spots = [
    {
        spotId: '12',
        building: 'Building A',
        level: 2,
        status: 'Assigned',
        assignedTo: 'John Smith',
    },
    {
        spotId: '8',
        building: 'Building B',
        level: 1,
        status: 'Assigned',
        assignedTo: 'Sarah Johnson',
    },
    {
        spotId: '24',
        building: 'Building A',
        level: 3,
        status: 'Assigned',
        assignedTo: 'Michael Brown',
    },
    {
        spotId: '15',
        building: 'Building A',
        level: 2,
        status: 'Available',
        assignedTo: 'Unassigned',
    },
    {
        spotId: '22',
        building: 'Building A',
        level: 3,
        status: 'Available',
        assignedTo: 'Unassigned',
    },
    {
        spotId: '9',
        building: 'Building B',
        level: 1,
        status: 'Available',
        assignedTo: 'Unassigned',
    },
    {
        spotId: '5',
        building: 'Building C',
        level: 1,
        status: 'Assigned',
        assignedTo: 'Emily Davis',
    },
    {
        spotId: '18',
        building: 'Building B',
        level: 2,
        status: 'Maintenance',
        assignedTo: 'Unassigned',
    },
];

export const registeredResidents = [
    {
        name: 'John Smith',
        email: 'john.smith@example.com',
        registeredDate: '2025-10-01',
        apartment: 'A-101',
        currentSpot: null,
    },
    {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        registeredDate: '2025-10-02',
        apartment: 'B-205',
        currentSpot: 'B-18',
    },
    {
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        registeredDate: '2025-10-03',
        apartment: 'A-310',
        currentSpot: null,
    },
    {
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        registeredDate: '2025-10-04',
        apartment: 'C-112',
        currentSpot: 'C-05',
    },
    {
        name: 'David Wilson',
        email: 'david.wilson@example.com',
        registeredDate: '2025-10-05',
        apartment: 'B-402',
        currentSpot: null,
    },
];

export const previousRaffles = [
    {
        date: '2023-07-01',
        participants: 42,
        assigned: 35,
        status: 'Completed',
        winners: [
            { name: 'John Smith', spot: 'A-15' },
            { name: 'Sarah Johnson', spot: 'B-22' },
            { name: 'Michael Brown', spot: 'C-08' },
        ],
    },
    {
        date: '2023-04-01',
        participants: 38,
        assigned: 32,
        status: 'Completed',
        winners: [
            { name: 'Emily Davis', spot: 'A-12' },
            { name: 'David Wilson', spot: 'B-18' },
            { name: 'Jennifer Martinez', spot: 'C-05' },
        ],
    },
    {
        date: '2023-01-01',
        participants: 45,
        assigned: 35,
        status: 'Completed',
        winners: [
            { name: 'Robert Taylor', spot: 'A-09' },
            { name: 'Lisa Anderson', spot: 'B-14' },
            { name: 'William Jones', spot: 'C-11' },
        ],
    },
];
