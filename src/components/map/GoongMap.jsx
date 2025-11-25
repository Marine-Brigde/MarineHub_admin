// src/components/GoongMap.jsx
import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css'; // Import CSS ở đây thay vì HTML

// Get Goong keys from environment variables
const MAP_KEY = import.meta.env.VITE_GOONG_MAP_KEY || 'ebt7JiGUl4WpHtDy5kpe4JB299y5TAm63e9My9Z6';
const API_KEY = import.meta.env.VITE_GOONG_API_KEY || 'C6cwG6MCfcHXlBVpKbzFqKkeS2d0AxM1N6uW5Y03';

function MapComponent({ onLocationSelect }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState('');
    const debounceTimeout = useRef(null);

    // Initialize map
    useEffect(() => {
        if (mapContainer.current && !map.current) {
            map.current = new maplibregl.Map({
                container: mapContainer.current,
                style: `https://tiles.goong.io/assets/goong_satellite.json?api_key=${MAP_KEY}`,
                center: [106.660172, 10.762622], // Default center (Ho Chi Minh City)
                zoom: 12,
            });

            map.current.on('load', () => {
                map.current.addControl(new maplibregl.NavigationControl());
            });

            // Add click event for manual marker placement
            map.current.on('click', (e) => {
                const lngLat = [e.lngLat.lng, e.lngLat.lat];
                fetchReverseGeocode(lngLat);
            });
        }

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    // Function to draw a circle
    const drawCircle = (center, radiusInMeters) => {
        const points = 64;
        const coords = {
            latitude: center[1],
            longitude: center[0],
        };
        const km = radiusInMeters / 1000;
        const ret = [];
        const distanceX = km / (111.320 * Math.cos((coords.latitude * Math.PI) / 180));
        const distanceY = km / 110.574;
        for (let i = 0; i < points; i++) {
            const theta = (i / points) * (2 * Math.PI);
            const x = distanceX * Math.cos(theta);
            const y = distanceY * Math.sin(theta);
            ret.push([coords.longitude + x, coords.latitude + y]);
        }
        ret.push(ret[0]);
        return ret;
    };

    // Function to add marker and circle
    const addMarkerAndCircle = (lngLat) => {
        if (map.current) {
            // Remove existing marker and circle
            if (map.current.getLayer('circle')) {
                map.current.removeLayer('circle');
                map.current.removeSource('circle');
            }
            document.querySelectorAll('.maplibregl-marker').forEach((el) => el.remove());

            // Add new marker
            new maplibregl.Marker().setLngLat(lngLat).addTo(map.current);

            // Add circle
            const circleData = {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'Polygon',
                            coordinates: [drawCircle(lngLat, 500)],
                        },
                        properties: {}, // Thêm properties cho đúng chuẩn GeoJSON
                    },
                ],
            };

            map.current.addSource('circle', {
                type: 'geojson',
                data: circleData,
            });

            map.current.addLayer({
                id: 'circle',
                type: 'fill',
                source: 'circle',
                layout: {},
                paint: {
                    'fill-color': '#588888',
                    'fill-opacity': 0.5,
                },
            });

            // Fly to location
            map.current.flyTo({ center: lngLat, zoom: 14 });
        }
    };

    // Fetch autocomplete suggestions
    const fetchDataAutoComplete = async (input) => {
        if (!input || input.length < 3) {
            setSuggestions([]);
            return;
        }
        const apiLink = `https://rsapi.goong.io/place/autocomplete?api_key=${API_KEY}&input=${encodeURIComponent(input)}`;
        try {
            const response = await fetch(apiLink);
            const data = await response.json();
            if (data.predictions) {
                setSuggestions(data.predictions);
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error('Error fetching autocomplete:', error);
            setError('Không thể tải gợi ý địa chỉ');
            setSuggestions([]);
        }
    };

    // Fetch place details
    const fetchPlaceDetails = async (placeId, description) => {
        const apiLink = `https://rsapi.goong.io/place/detail?api_key=${API_KEY}&place_id=${placeId}`;
        try {
            const response = await fetch(apiLink);
            const data = await response.json();
            if (data.result) {
                const { location } = data.result.geometry;
                const lngLat = [location.lng, location.lat];
                addMarkerAndCircle(lngLat);
                onLocationSelect(location.lat.toString(), location.lng.toString(), description);
                setError('');
            } else {
                setError('Không tìm thấy chi tiết địa điểm');
            }
        } catch (error) {
            console.error('Error fetching place details:', error);
            setError('Lỗi khi tải chi tiết địa điểm');
        }
    };

    // Fetch address from coordinates (reverse geocoding)
    const fetchReverseGeocode = async (lngLat) => {
        const apiLink = `https://rsapi.goong.io/geocode?latlng=${lngLat[1]},${lngLat[0]}&api_key=${API_KEY}`;
        try {
            const response = await fetch(apiLink);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const address = data.results[0].formatted_address;
                addMarkerAndCircle(lngLat);
                onLocationSelect(lngLat[1].toString(), lngLat[0].toString(), address);
                setError('');
            } else {
                setError('Không tìm thấy địa chỉ cho vị trí này');
                addMarkerAndCircle(lngLat);
                onLocationSelect(lngLat[1].toString(), lngLat[0].toString(), '');
            }
        } catch (error) {
            console.error('Error fetching reverse geocode:', error);
            setError('Lỗi khi lấy địa chỉ từ tọa độ');
            addMarkerAndCircle(lngLat);
            onLocationSelect(lngLat[1].toString(), lngLat[0].toString(), '');
        }
    };

    // Debounce autocomplete requests
    const handleSearch = (value) => {
        setQuery(value);
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            fetchDataAutoComplete(value);
        }, 500); // 500ms debounce
    };

    return (
        <div className="space-y-3 h-full flex flex-col">
            <div className="space-y-2">
                <input
                    id="address-search"
                    placeholder="Nhập địa chỉ để tìm kiếm hoặc nhấp vào bản đồ để chọn vị trí"
                    className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 ${
                        'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 dark:border-blue-800/60 dark:bg-blue-900/40 dark:text-slate-100 dark:placeholder:text-blue-300/50 dark:focus:border-cyan-500/50 dark:focus:ring-cyan-500/20'
                    }`}
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            {error && (
                <div className={`text-sm p-2 rounded-lg ${
                    'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
                }`}>
                    {error}
                </div>
            )}
            {suggestions.length > 0 && (
                <div className={`max-h-32 overflow-y-auto rounded-lg border ${
                    'bg-white border-gray-200 dark:bg-zinc-800 dark:border-zinc-700'
                }`}>
                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion.place_id}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 border-b last:border-b-0 ${
                                'dark:border-zinc-700'
                            }`}
                            onClick={() => {
                                setQuery(suggestion.description);
                                setSuggestions([]);
                                fetchPlaceDetails(suggestion.place_id, suggestion.description);
                            }}
                        >
                            {suggestion.description}
                        </button>
                    ))}
                </div>
            )}
            <div ref={mapContainer} className="w-full flex-1 rounded-lg overflow-hidden" style={{ minHeight: '300px' }} />
        </div>
    );
}

export default MapComponent;