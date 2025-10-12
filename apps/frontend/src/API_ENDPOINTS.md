# API Endpoints Reference

Complete reference of all available API endpoints in the Parking Management System frontend.

---

## 🏠 Residents

### Get All Residents

**Endpoint**: `GET /api/residents`

**Query Parameters**:

- `page` (number, optional) - Page number, default: 1
- `limit` (number, optional) - Items per page, default: 10
- `search` (string, optional) - Search by name or email
- `building` (string, optional) - Filter by building
- `hasParking` (boolean, optional) - Filter by parking allocation status

**Response**:

```json
{
    "residents": [
        {
            "id": "res-001",
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+1234567890",
            "building": "A",
            "apartmentNumber": "101",
            "hasCar": true,
            "registeredForRaffle": false,
            "createdAt": "2025-01-01T00:00:00Z"
        }
    ],
    "total": 100,
    "page": 1,
    "totalPages": 10
}
```

**Service Method**: `ResidentService.getAllResidents(params)`

---

### Get Resident by ID

**Endpoint**: `GET /api/residents/:id`

**Response**:

```json
{
    "id": "res-001",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "building": "A",
    "apartmentNumber": "101",
    "hasCar": true,
    "registeredForRaffle": false,
    "parkingAllocation": {
        "spotId": "A-101",
        "spot": {
            "id": "A-101",
            "building": "A",
            "level": 1,
            "type": "regular"
        },
        "validUntil": "2025-12-31T23:59:59Z"
    },
    "createdAt": "2025-01-01T00:00:00Z"
}
```

**Service Method**: `ResidentService.getResidentById(id)`

---

### Create Resident

**Endpoint**: `POST /api/residents`

**Request Body**:

```json
{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "building": "B",
    "apartmentNumber": "202",
    "hasCar": true
}
```

**Response**: Returns created resident object

**Service Method**: `ResidentService.createResident(data)`

---

### Update Resident (Full)

**Endpoint**: `PUT /api/residents/:id`

**Request Body**: All resident fields required

**Service Method**: `ResidentService.updateResident(id, data)`

---

### Update Resident (Partial)

**Endpoint**: `PATCH /api/residents/:id`

**Request Body**: Only fields to update

**Service Method**: `ResidentService.patchResident(id, updates)`

---

### Delete Resident

**Endpoint**: `DELETE /api/residents/:id`

**Response**:

```json
{
    "success": true,
    "message": "Resident deleted successfully"
}
```

**Service Method**: `ResidentService.deleteResident(id)`

---

### Get Parking History

**Endpoint**: `GET /api/residents/:id/parking-history`

**Response**:

```json
[
  {
    "id": "alloc-001",
    "residentId": "res-001",
    "spotId": "A-101",
    "spot": { ... },
    "startDate": "2025-01-01T00:00:00Z",
    "endDate": "2025-12-31T23:59:59Z",
    "status": "active"
  }
]
```

**Service Method**: `ResidentService.getResidentParkingHistory(id)`

---

### Register for Raffle

**Endpoint**: `POST /api/residents/:id/raffle-registration`

**Request Body** (optional):

```json
{
    "preferences": {
        "preferredBuilding": "A",
        "electricChargingRequired": false
    }
}
```

**Response**:

```json
{
  "success": true,
  "message": "Successfully registered for raffle",
  "resident": { ... }
}
```

**Service Method**: `ResidentService.registerForRaffle(id, data)`

---

### Unregister from Raffle

**Endpoint**: `DELETE /api/residents/:id/raffle-registration`

**Response**:

```json
{
    "success": true,
    "message": "Successfully unregistered from raffle"
}
```

**Service Method**: `ResidentService.unregisterFromRaffle(id)`

---

## 🎲 Raffles

### Get All Raffles

**Endpoint**: `GET /api/raffles`

**Query Parameters**:

- `page` (number, optional)
- `limit` (number, optional)
- `status` (string, optional) - Values: `active`, `completed`, `scheduled`, `cancelled`
- `dateFrom` (string, optional) - ISO date
- `dateTo` (string, optional) - ISO date

**Response**:

```json
{
    "raffles": [
        {
            "id": "raffle-001",
            "name": "January 2025 Parking Raffle",
            "scheduledDate": "2025-01-15T10:00:00Z",
            "spotsAvailable": 10,
            "participantsCount": 45,
            "status": "active",
            "registrationDeadline": "2025-01-14T23:59:59Z",
            "durationMonths": 6
        }
    ],
    "total": 12,
    "page": 1,
    "totalPages": 2
}
```

**Service Method**: `RaffleService.getAllRaffles(params)`

---

### Get Current Raffle

**Endpoint**: `GET /api/raffles/current`

**Response**: Single raffle object or `null`

**Service Method**: `RaffleService.getCurrentRaffle()`

---

### Get Raffle by ID

**Endpoint**: `GET /api/raffles/:id`

**Response**:

```json
{
    "id": "raffle-001",
    "name": "January 2025 Parking Raffle",
    "scheduledDate": "2025-01-15T10:00:00Z",
    "spotsAvailable": 10,
    "participantsCount": 45,
    "participants": [
        { "id": "res-001", "name": "John Doe", "registeredAt": "..." }
    ],
    "winners": [{ "residentId": "res-002", "spotId": "A-101" }],
    "status": "completed",
    "executedAt": "2025-01-15T10:05:00Z"
}
```

**Service Method**: `RaffleService.getRaffleById(id)`

---

### Create/Schedule Raffle

**Endpoint**: `POST /api/raffles`

**Request Body**:

```json
{
    "name": "February 2025 Parking Raffle",
    "scheduledDate": "2025-02-15T10:00:00Z",
    "spotsAvailable": 15,
    "registrationDeadline": "2025-02-14T23:59:59Z",
    "durationMonths": 6
}
```

**Service Method**: `RaffleService.createRaffle(data)`

---

### Execute Raffle

**Endpoint**: `POST /api/raffles/:id/execute`

**Request Body**:

```json
{
    "sendNotifications": true,
    "algorithm": "random"
}
```

**Response**:

```json
{
  "success": true,
  "raffleId": "raffle-001",
  "winners": [
    {
      "residentId": "res-001",
      "resident": { ... },
      "spotId": "A-101",
      "spot": { ... }
    }
  ],
  "executedAt": "2025-01-15T10:05:00Z"
}
```

**Service Method**: `RaffleService.runRaffle(id, options)`

---

### Get Raffle Participants

**Endpoint**: `GET /api/raffles/:id/participants`

**Service Method**: `RaffleService.getRaffleParticipants(id, params)`

---

### Get Raffle Winners

**Endpoint**: `GET /api/raffles/:id/winners`

**Service Method**: `RaffleService.getRaffleWinners(id)`

---

### Cancel Raffle

**Endpoint**: `POST /api/raffles/:id/cancel`

**Request Body**:

```json
{
    "reason": "Insufficient parking spots available"
}
```

**Service Method**: `RaffleService.cancelRaffle(id, reason)`

---

### Preview Raffle Results

**Endpoint**: `POST /api/raffles/:id/preview`

**Service Method**: `RaffleService.previewRaffleResults(id, options)`

---

## 🚗 Parking Spots

### Get All Parking Spots

**Endpoint**: `GET /api/parking-spots`

**Query Parameters**:

- `page` (number, optional)
- `limit` (number, optional)
- `building` (string, optional)
- `level` (number, optional)
- `status` (string, optional) - Values: `available`, `occupied`, `reserved`, `maintenance`
- `type` (string, optional) - Values: `regular`, `handicap`, `compact`, `electric`

**Response**:

```json
{
    "spots": [
        {
            "id": "A-101",
            "number": "101",
            "building": "A",
            "level": 1,
            "type": "regular",
            "status": "available",
            "location": "North wing, near elevator",
            "hasElectricCharging": false
        }
    ],
    "total": 50,
    "page": 1,
    "totalPages": 5
}
```

**Service Method**: `ParkingSpotService.getAllSpots(params)`

---

### Get Spot by ID

**Endpoint**: `GET /api/parking-spots/:id`

**Response**: Single spot object with current assignment details

**Service Method**: `ParkingSpotService.getSpotById(id)`

---

### Get Available Spots

**Endpoint**: `GET /api/parking-spots/available`

**Service Method**: `ParkingSpotService.getAvailableSpots(params)`

---

### Create Parking Spot

**Endpoint**: `POST /api/parking-spots`

**Request Body**:

```json
{
    "number": "102",
    "building": "A",
    "level": 1,
    "type": "regular",
    "location": "South wing",
    "hasElectricCharging": false
}
```

**Service Method**: `ParkingSpotService.createSpot(data)`

---

### Update Parking Spot

**Endpoint**: `PUT /api/parking-spots/:id`

**Service Method**: `ParkingSpotService.updateSpot(id, data)`

---

### Assign Spot to Resident

**Endpoint**: `POST /api/parking-spots/:id/assign`

**Request Body**:

```json
{
    "residentId": "res-001",
    "startDate": "2025-01-15T00:00:00Z",
    "endDate": "2025-07-15T23:59:59Z",
    "notes": "Winner of January raffle"
}
```

**Response**:

```json
{
    "success": true,
    "allocation": {
        "id": "alloc-001",
        "residentId": "res-001",
        "spotId": "A-101",
        "startDate": "2025-01-15T00:00:00Z",
        "validUntil": "2025-07-15T23:59:59Z",
        "createdAt": "2025-01-15T10:05:00Z"
    }
}
```

**Service Method**: `ParkingSpotService.assignSpot(spotId, data)`

---

### Release Spot

**Endpoint**: `POST /api/parking-spots/:id/release`

**Request Body**:

```json
{
    "reason": "Allocation period ended",
    "effectiveDate": "2025-07-15T23:59:59Z"
}
```

**Response**:

```json
{
    "success": true,
    "message": "Parking spot released successfully"
}
```

**Service Method**: `ParkingSpotService.releaseSpot(spotId, data)`

---

### Reserve Spot

**Endpoint**: `POST /api/parking-spots/:id/reserve`

**Service Method**: `ParkingSpotService.reserveSpot(spotId, data)`

---

### Get Spot History

**Endpoint**: `GET /api/parking-spots/:id/history`

**Service Method**: `ParkingSpotService.getSpotHistory(spotId)`

---

### Mark Spot as Under Maintenance

**Endpoint**: `POST /api/parking-spots/:id/maintenance`

**Request Body**:

```json
{
    "startDate": "2025-01-20T00:00:00Z",
    "endDate": "2025-01-25T00:00:00Z",
    "reason": "Repainting and line marking"
}
```

**Service Method**: `ParkingSpotService.markSpotMaintenance(spotId, data)`

---

### Complete Maintenance

**Endpoint**: `POST /api/parking-spots/:id/maintenance/complete`

**Service Method**: `ParkingSpotService.completeSpotMaintenance(spotId)`

---

### Swap Spot Assignments

**Endpoint**: `POST /api/parking-spots/swap`

**Request Body**:

```json
{
    "spot1Id": "A-101",
    "spot2Id": "B-202",
    "reason": "Resident request - closer to apartment"
}
```

**Service Method**: `ParkingSpotService.swapSpotAssignments(spot1Id, spot2Id, reason)`

---

## 📊 Statistics & Bulk Operations

### Get Spot Statistics

**Endpoint**: `GET /api/parking-spots/stats`

**Service Method**: `ParkingSpotService.getSpotStats(params)`

---

### Get Raffle Statistics

**Endpoint**: `GET /api/raffles/stats`

**Service Method**: `RaffleService.getRaffleStats()`

---

### Bulk Import Residents

**Endpoint**: `POST /api/residents/bulk-import`

**Service Method**: `ResidentService.bulkImportResidents(residents)`

---

### Bulk Import Spots

**Endpoint**: `POST /api/parking-spots/bulk-import`

**Service Method**: `ParkingSpotService.bulkImportSpots(spots)`

---

### Export Residents

**Endpoint**: `GET /api/residents/export?format=csv`

**Service Method**: `ResidentService.exportResidents(params)`

---

### Export Spots

**Endpoint**: `GET /api/parking-spots/export?format=csv`

**Service Method**: `ParkingSpotService.exportSpots(params)`

---

## 🔒 Error Responses

All endpoints may return the following error formats:

### 400 Bad Request

```json
{
    "error": "Missing required fields",
    "fields": ["name", "email"]
}
```

### 401 Unauthorized

```json
{
    "error": "Unauthorized",
    "message": "Authentication required"
}
```

### 403 Forbidden

```json
{
    "error": "Forbidden",
    "message": "Insufficient permissions"
}
```

### 404 Not Found

```json
{
    "error": "Resident not found"
}
```

### 405 Method Not Allowed

```json
{
    "error": "Method not allowed"
}
```

### 500 Internal Server Error

```json
{
    "error": "Internal server error",
    "message": "Failed to fetch residents"
}
```

---

## 🔄 Service Integration Examples

### Using Services in Components

```javascript
import { getAllResidents } from '@/services/ResidentService';

async function fetchData() {
    try {
        const data = await getAllResidents({ page: 1, limit: 20 });
        console.log(data.residents);
    } catch (error) {
        console.error('Error:', error.message);
    }
}
```

### Using Services in SSR

```javascript
// pages/residents.jsx
import { getAllResidents } from '@/services/ResidentService';

export async function getServerSideProps() {
    const data = await getAllResidents();
    return { props: { residents: data.residents } };
}
```

---

**Last Updated**: October 12, 2025
