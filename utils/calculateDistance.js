// Function to calculate the distance between two lat/lon points in kilometers
function calculateDistance(lat1, lon1, lat2, lon2) {
    // Convert degrees to radians
    const toRad = (degrees) => degrees * (Math.PI / 180);

    // Radius of the Earth in kilometers
    const R = 6371;

    // Difference in latitude and longitude
    const deltaLat = toRad(lat2 - lat1);
    const deltaLon = toRad(lon2 - lon1);

    // Haversine formula
    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
              Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distance in kilometers
    const distance = R * c;

    return distance; // Returns the distance in kilometers
}

module.exports =calculateDistance;