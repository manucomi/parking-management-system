/**
 * Services Index - Central export point for all service modules
 */

export * as ResidentService from './ResidentService/ResidentService';
export * as RaffleService from './RaffleService/RaffleService';
export * as ParkingSpotService from './ParkingSpotService/ParkingSpotService';

export {
    getAllResidents,
    getResidentById,
    createResident,
    updateResident,
    deleteResident,
    registerForRaffle,
    unregisterFromRaffle,
} from './ResidentService/ResidentService';

export {
    getCurrentRaffle,
    getAllRaffles,
    getRaffleById,
    createRaffle,
    runRaffle,
    getRaffleParticipants,
} from './RaffleService/RaffleService';

export {
    getAllSpots,
    getSpotById,
    createSpot,
    deleteSpot,
    assignSpot,
    releaseSpot,
} from './ParkingSpotService/ParkingSpotService';
