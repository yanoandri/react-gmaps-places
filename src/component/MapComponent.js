import React, { useEffect, useRef, useState } from "react"

export const MapComponent = (props) => {
    const {
        center,
        zoom,
    } = props
    const mapRef = useRef();
    const autoCompleteRef = useRef();
    const [markers, setMarkers] = useState([])
    const [map, setMap] = useState();

    const placeSearchBox = () => {
        const options = {
            fields: ["formatted_address", "geometry", "name"],
            strictBounds: false,
            types: ["establishment"],
        };

        map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(autoCompleteRef.current);

        const searchBox = new window.google.maps.places.Autocomplete(autoCompleteRef.current, options);

        searchBox.bindTo("bounds", map);

        searchBox.addListener("place_changed", () => {
            removeCurrentMarker()

            const newMarker = new window.google.maps.Marker({
                map,
                anchorPoint: new window.google.maps.Point(0, -29),
            });
            const place = searchBox.getPlace()

            if (!place.geometry || !place.geometry.location) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                window.alert("No details available for input: '" + place.name + "'");
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
            }
            map.setZoom(zoom);

            newMarker.setPosition(place.geometry.location)
  
            markers.push(newMarker)

            console.log(place.name)
        })
        
    }

    const removeCurrentMarker = () => {
        if (markers && markers.length > 0) {
            markers.forEach(data => {
                data.setMap(null)
            })
            setMarkers([])
        } 
    }

    const onClick = (e) => {
        removeCurrentMarker()

        const newMarker = new window.google.maps.Marker({
            position: e.latLng.toJSON(),
            map,
        })

        map.setCenter(newMarker.getPosition())

        markers.push(newMarker)
    }


    useEffect(() => {
        if (mapRef.current && !map) {
            setMap(new window.google.maps.Map(mapRef.current, {
                center,
                zoom
            }))
        }
    }, [mapRef]);

    useEffect(() => {
        if (map) {
            window.google.maps.event.clearListeners(map, 'click')

            map.addListener("click", onClick);

            placeSearchBox()
        }
    }, [mapRef, map])

    return (
        <>
            <input ref={autoCompleteRef} type={`text`} id="search-autocomplete" />
            <div ref={mapRef} id="map" />
        </>
    )
}