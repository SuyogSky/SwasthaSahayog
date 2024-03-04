import React, { useState, useEffect } from 'react';

function NearbyDoctors() {
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        const checkLocation = async () => {
            if (!userLocation) {
                if (navigator.geolocation) {
                    try {
                        const position = await new Promise((resolve, reject) => {
                            navigator.geolocation.getCurrentPosition(resolve, reject);
                        });

                        const { latitude, longitude } = position.coords;
                        setUserLocation({ latitude, longitude });
                    } catch (error) {
                        console.error("Error getting location:", error);
                        setUserLocation('Default Location'); // Set a default location if there's an error or user denies location access
                    }
                } else {
                    console.error("Geolocation is not supported by this browser.");
                    setUserLocation('Default Location'); // Set a default location if geolocation is not supported
                }
            }
        };

        checkLocation();
    }, [userLocation]);

    return (
        <section className="nearby-doctors-section">
            <h1>Nearby Doctors</h1>
            {userLocation && (
                <p>User location: {userLocation.latitude}, {userLocation.longitude}</p>
            )}
        </section>
    );
}

export default NearbyDoctors;
