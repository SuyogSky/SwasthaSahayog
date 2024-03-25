import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import osm from '../../../../osm-provider';
import cities from '../../../../assets/cities.json';
import useGeoLocation from "../../../../useGeoLocation";
import NavBar from "../../../NavBar/NavBar";
import Axios from 'axios';
import ip from "../../../../ip";
import { useHistory } from "react-router-dom";
import swal from 'sweetalert2';
import userMarker from "../../../../assets/Images/user_marker.png";
import Image from "../../../../assets/Images/marker.png";
import './Map.scss'
import useAxios from '../../../../utils/useAxios';
const markerIcon = new L.Icon({
    iconUrl: Image,
    iconSize: [35, 45],
    iconAnchor: [17, 46],
    popupAnchor: [0, -46],
});

const userIcon = new L.Icon({
    iconUrl: userMarker,
    iconSize: [35, 45],
    iconAnchor: [17, 46],
    popupAnchor: [0, -46],
});

const ZOOM_LEVEL = 9;

const ClinicLocation = ({ doctor }) => {
    const axios = useAxios()
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [markers, setMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [isAddingMarker, setIsAddingMarker] = useState(false);
    const [drawControl, setDrawControl] = useState(null);
    const [mapCenter, setMapCenter] = useState([27.7172, 85.3240])
    const mapRef = useRef();
    const location = useGeoLocation();

    // const currentClinicLocation = doctor.clinic_location
    // const [currentLat, currentLong] = currentClinicLocation?.split(",").map(parseFloat);

    const currentClinicLocation = doctor.clinic_location;
    const [currentLat, setCurrentLat] = useState(null)
    const [currentLong, setCurrentLong] = useState(null)
    // Check if currentClinicLocation exists and contains a comma
    useEffect(() => {
        if (currentClinicLocation && currentClinicLocation.includes(",")) {
            const [currentLat, currentLong] = currentClinicLocation.split(",").map(parseFloat);
            setCurrentLat(currentLat)
            setCurrentLong(currentLong)
            setMapCenter([currentLat, currentLong])
            console.log("Latitude:", currentLat);
            console.log("Longitude:", currentLong);
        } else {
            console.error("Invalid clinic location format:", currentClinicLocation);
        }
    }, [doctor, currentClinicLocation])

    const _onCreate = (e) => {
        const { lat, lng } = e.layer.getLatLng();
        const newMarker = { lat, lng };
        setMarkers([...markers, newMarker]);
        console.log('Marker created at:', newMarker);
    };

    const _onEdited = (e) => {
        console.log(e);
    };

    const _onDeleted = (e) => {
        console.log(e);
    };

    const toggleMarkerAdding = () => {
        setIsAddingMarker(!isAddingMarker);
        if (drawControl) {
            drawControl._toolbars.edit._modes.marker.handler.enable();
        }
    };

    const handleMapClick = (e) => {
        if (isAddingMarker) {
            const { lat, lng } = e.latlng;
            const newMarker = { lat, lng };
            setMarkers([...markers, newMarker]);
            console.log('Marker added at:', newMarker);
            setIsAddingMarker(false);
        }
    };

    const handleMarkerClick = (marker) => {
        console.log('ihihihi')
        setSelectedMarker(marker);
    };

    const showMyLocation = () => {
        if (location.loaded && !location.error) {
            mapRef.current.flyTo([location.coordinates.lat, location.coordinates.lng], ZOOM_LEVEL, { animate: true });
        } else {
            alert(location.error.message);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const clinic_location = `${selectedMarker.lat.toFixed(6)},${selectedMarker.lng.toFixed(6)}`
        try {
            const response = await axios.patch(
                `${ip}/api/doctors/${doctor.id}/update_clinic_location/`,
                { clinic_location: clinic_location },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            console.log('Clinic location updated:', response.data);
            // Handle success or update UI accordingly
        } catch (error) {
            console.error('Error updating clinic location:', error);
        }
    };


    if (!loading) {
        return (
            <>
                <section className="map-section">
                    <form onSubmit={handleSubmit}>
                        <div className='top'>
                            <button type='button' onClick={toggleMarkerAdding}>
                                {isAddingMarker ? 'Disable Marker Adding' : 'Enable Marker Adding'}
                            </button>
                            <button type='button' onClick={showMyLocation}>
                                Show my location
                            </button>
                            <button type="submit">Submit</button>
                        </div>
                        <div className="display-map">
                            <MapContainer center={mapCenter} zoom={ZOOM_LEVEL} className="MapContainer" ref={mapRef} onClick={handleMapClick}>
                                <FeatureGroup>
                                    <EditControl
                                        position="topright"
                                        onCreated={_onCreate}
                                        onEdited={_onEdited}
                                        onDeleted={_onDeleted}
                                        ref={(ref) => setDrawControl(ref)}
                                        draw={{
                                            rectangle: false,
                                            polygon: false,
                                            circle: false,
                                            circlemarker: false,
                                            marker: isAddingMarker,
                                        }}
                                    />
                                </FeatureGroup>
                                <TileLayer url={osm.maptiler.url} attribution={osm.maptiler.attribute} />
                                {/* {cities.map((city, idx) => (
                                    <Marker position={[city.lat, city.lng]} icon={markerIcon} key={idx}>
                                        <Popup>
                                            <b>{city.city}, {city.country}</b>
                                        </Popup>
                                    </Marker>
                                ))} */}

                                {
                                    (currentLat && currentLong) && (
                                        <Marker position={[currentLat, currentLong]} icon={markerIcon}>
                                            <Popup>
                                                <b>Current Clinic Location:</b>
                                                <p>{currentLat}, {currentLong}</p>
                                            </Popup>
                                        </Marker>
                                    )
                                }


                                {markers.map((marker, idx) => (
                                    <Marker
                                        key={idx}
                                        position={[marker.lat, marker.lng]}
                                        icon={markerIcon}
                                        eventHandlers={{
                                            click: () => handleMarkerClick(marker), // Pass the marker object here
                                        }}
                                    >
                                        <Popup>
                                            <b>Marker at:</b> <br />
                                            Latitude: {marker.lat.toFixed(6)} <br />
                                            Longitude: {marker.lng.toFixed(6)}
                                        </Popup>
                                    </Marker>
                                ))}

                                {location.loaded && !location.error && (
                                    <Marker icon={userIcon} position={[location.coordinates.lat, location.coordinates.lng]}>
                                        <Popup>
                                            <b>Your Location</b>
                                        </Popup>
                                    </Marker>
                                )}
                            </MapContainer>
                        </div>
                    </form>
                </section >
                {selectedMarker && (
                    <div>
                        <p>
                            Selected Marker: Latitude - {selectedMarker.lat.toFixed(6)}, Longitude - {selectedMarker.lng.toFixed(6)}
                        </p>
                    </div>
                )
                }
            </>
        );
    } else {
        return (
            <p>Loaiding</p>
        );
    }
};

export default ClinicLocation;
