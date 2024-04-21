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
import UserMarker from "../../../../assets/Images/user_marker.png";
import ClinicMarker from "../../../../assets/Images/clinic-marker.png";
import './Map.scss'
import useAxios from '../../../../utils/useAxios';
import { IoMdLocate } from "react-icons/io";
const markerIcon = new L.Icon({
    iconUrl: ClinicMarker,
    iconSize: [35, 45],
    iconAnchor: [17, 46],
    popupAnchor: [0, -46],
});

const userIcon = new L.Icon({
    iconUrl: UserMarker,
    iconSize: [45, 45],
    iconAnchor: [17, 46],
    popupAnchor: [0, -46],
});

const ZOOM_LEVEL = 9;

const NearbyClinicsMap = ({ doctor }) => {
    const axios = useAxios()
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
        console.log('hihihihihih')
        if (location.loaded && !location.error) {
            mapRef?.current?.flyTo([location.coordinates.lat, location.coordinates.lng], ZOOM_LEVEL, { animate: true });
        } else {
            // alert(location.error.message);
        }
    };

    // const showClinicLocation = () => {
    //     if (currentClinicLocation && currentClinicLocation.includes(",")) {
    //         const [currentLat, currentLong] = currentClinicLocation.split(",").map(parseFloat);
    //         mapRef?.current?.flyTo([currentLat, currentLong], ZOOM_LEVEL, { animate: true });
    //     } else {
    //         console.error("Invalid clinic location format:", currentClinicLocation);
    //     }
    // };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const clinic_location = `${selectedMarker?.lat.toFixed(6)},${selectedMarker?.lng.toFixed(6)}` || null
        if (selectedMarker) {
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
                swal.fire({
                    title: "Location updated successfully.",
                    icon: "success",
                    toast: true,
                    timer: 3000,
                    position: "top-right",
                    timerProgressBar: true,
                    showConfirmButton: false,
                    showCloseButton: true,
                });
                // Handle success or update UI accordingly
            } catch (error) {
                console.error('Error updating clinic location:', error);
            }
        }
        else {
            swal.fire({
                title: "Please select a marker.",
                icon: "warning",
                toast: true,
                timer: 3000,
                position: "top-right",
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: true,
            });
        }
    };

    function isWithinTimeRange(openingTime, closingTime) {
        const currentTime = new Date();
        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
        const currentSeconds = currentTime.getSeconds();
        const currentTimeString = `${currentHours}:${currentMinutes}:${currentSeconds}`;
    
        return currentTimeString >= openingTime && currentTimeString <= closingTime;
    }


    if (!loading) {
        return (
            <>
                <section className="map-section">
                    <button className="my-location-btn" onClick={showMyLocation}><IoMdLocate /></button>
                    <form onSubmit={handleSubmit}>
                        <div className="display-map">
                            <MapContainer center={mapCenter} zoom={ZOOM_LEVEL} className="MapContainer" ref={mapRef} onClick={handleMapClick}>
                                {/* <FeatureGroup>
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
                                </FeatureGroup> */}
                                <TileLayer url={osm.maptiler.url} attribution={osm.maptiler.attribute} />
                                {doctor.map((doctor, idx) => {
                                    // const [clinicLat, clinicLong] = doctor.doctor.clinic_location.split(",").map(parseFloat);
                                    const [clinicLat, clinicLong] = doctor.doctor.clinic_location ? doctor.doctor.clinic_location.split(",").map(parseFloat) : [0, 0];

                                    console.log(clinicLat, clinicLong)
                                    console.log('Doctor clinics are: ', doctor)
                                    return(
                                    <Marker position={[clinicLat, clinicLong]} icon={markerIcon} key={idx}>
                                        <Popup>
                                            <div className="popup-div">
                                                <div className="top">
                                                    <div className={`image ${isWithinTimeRange(doctor.doctor.opening_time, doctor.doctor.closing_time)?'online':'offline'}`} style={doctor ? {
                                                        backgroundImage: `url(${ip}${doctor.doctor.image})`,
                                                        backgroundPosition: 'center',
                                                        backgroundSize: 'cover',
                                                        backgroundRepeat: 'no-repeat',
                                                    } : null}>
                                                        
                                                    </div>
                                                    <div className="details">
                                                        <b>{doctor.doctor.username}</b>
                                                        <span>{doctor.doctor.speciality}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )})}

                                {/* {
                                    (currentLat && currentLong) && (
                                        <Marker position={[currentLat, currentLong]} icon={markerIcon}>
                                            <Popup>
                                                <b>Current Clinic Location:</b>
                                                <p>{currentLat}, {currentLong}</p>
                                            </Popup>
                                        </Marker>
                                    )
                                } */}


                                {/* {markers.map((marker, idx) => (
                                    <Marker
                                        key={idx}
                                        position={[marker.lat, marker.lng]}
                                        icon={markerIcon}
                                        eventHandlers={{
                                            click: () => handleMarkerClick(marker), // Pass the marker object here
                                        }}
                                        zIndexOffset={100}
                                    >
                                        <Popup>
                                            <b>Marker at:</b> <br />
                                            Latitude: {marker.lat.toFixed(6)} <br />
                                            Longitude: {marker.lng.toFixed(6)}
                                        </Popup>
                                    </Marker>
                                ))} */}

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

export default NearbyClinicsMap;
