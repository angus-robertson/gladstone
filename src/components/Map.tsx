import maplibregl, { StyleSpecification } from 'maplibre-gl';
import { Ref, useCallback, useEffect, useRef, useState } from 'react';
import { FullscreenControl, Map as MapGL, MapRef, NavigationControl, ScaleControl } from 'react-map-gl/maplibre';

interface MapProps {

};

export const ProjectMap: React.FC<{}> = ({}): React.JSX.Element => {
    const [mapStyle, setMapStyle] = useState<StyleSpecification | undefined>({
        version: 8,
        sources: {},
        layers: [],
        "glyphs": "http://fonts.openmaptiles.org/{fontstack}/{range}.pbf"
    });
    const [zoom, ] = useState<number>(4);
    const actualMapRef = useRef<MapRef | undefined>(undefined);

    const setDefaultStyle = () => {
        fetch('https://basemaps.cartocdn.com/gl/positron-gl-style/style.json').then(res => res.text()).then(style => setMapStyle(JSON.parse(style)));
    };

    useEffect( () => {
        setDefaultStyle();
    }, []);

    const mapReference = useCallback( (mapRef: MapRef) => {
        if (mapRef != null) {
            actualMapRef.current = mapRef;
        }
    }, []);

    return (
        <MapGL
            ref={mapReference as Ref<MapRef>}
            initialViewState={{
                latitude: -27.7,
                longitude: 132.7,
                zoom: zoom,
                bearing: 0,
                pitch: 0
            }}
            style={{width: '100vw', height: '100vh'}}
            mapLib={maplibregl}
            mapStyle={mapStyle}
            styleDiffing={false}
        >

            {/* LAYERS */}
        
            {/* CONTROLS */}
            <FullscreenControl />
            <ScaleControl maxWidth={200} style={{borderRadius: '0px', backgroundColor: '#ffffff20'}} />
            <NavigationControl />

        </MapGL>
    )
}