// backend.js

const apiKey = process.env.API_KEY; // Replace with your NASA API key

async function searchAsteroidByName(name) {
    const apiUrl = `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${apiKey}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const asteroids = data.near_earth_objects;
        
        // Filter asteroids by name
        const results = asteroids.filter(asteroid => asteroid.name.toLowerCase().includes(name.toLowerCase()));
        
        return results;
    } catch (error) {
        console.error('Error fetching data from NASA API:', error);
        return [];
    }
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (results.length > 0) {
        results.forEach(asteroid => {
            const asteroidInfo = `
                <div>
                    <h2>${asteroid.name}</h2>
                    <p>Date of approach: ${asteroid.close_approach_data[0].close_approach_date}</p>
                    <p>Magnitude: ${asteroid.absolute_magnitude_h}</p>
                    <p>Diameter (min - max): ${asteroid.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} - ${asteroid.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km</p>
                    <p>Potentially hazardous: ${asteroid.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}</p>
                </div>
            `;
            resultsDiv.innerHTML += asteroidInfo;
        });
    } else {
        resultsDiv.innerHTML = 'No asteroids found';
    }
}

document.getElementById('nameSearchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const searchInput = document.getElementById('searchByName').value;

    searchAsteroidByName(searchInput).then(results => {
        displayResults(results);
    });
});
