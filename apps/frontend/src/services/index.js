/**
 * Services Index
 * Central export point for all service modules
 */

export * as ResidentService from './ResidentService/ResidentService';
export * as RaffleService from './RaffleService/RaffleService';
export * as ParkingSpotService from './ParkingSpotService/ParkingSpotService';

// Re-export individual service functions for convenience
export {
    getAllResidents,
    getResidentById,
    createResident,
    updateResident,
    patchResident,
    deleteResident,
    getResidentParkingHistory,
    registerForRaffle,
    unregisterFromRaffle,
    getEligibleResidents,
    bulkImportResidents,
    exportResidents,
} from './ResidentService/ResidentService';

export {
    getCurrentRaffle,
    getAllRaffles,
    getRaffleById,
    createRaffle,
    updateRaffle,
    deleteRaffle,
    runRaffle,
    getRaffleParticipants,
    getRaffleWinners,
    cancelRaffle,
    getRaffleStats,
    revertRaffle,
    previewRaffleResults,
    sendRaffleNotifications,
} from './RaffleService/RaffleService';

export {
    getAllSpots,
    getSpotById,
    getAvailableSpots,
    createSpot,
    updateSpot,
    patchSpot,
    deleteSpot,
    assignSpot,
    releaseSpot,
    reserveSpot,
    getSpotHistory,
    markSpotMaintenance,
    completeSpotMaintenance,
    getSpotStats,
    bulkImportSpots,
    exportSpots,
    swapSpotAssignments,
} from './ParkingSpotService/ParkingSpotService';
