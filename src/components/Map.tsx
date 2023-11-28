import maplibregl, { StyleSpecification } from 'maplibre-gl';
import { Ref, useCallback, useEffect, useRef, useState } from 'react';
import { FullscreenControl, Layer, Map as MapGL, MapRef, NavigationControl, ScaleControl, Source } from 'react-map-gl/maplibre';
import { Protocol } from 'pmtiles';

const tilesUrl = `pmtiles://${new URL('../assets/infrastructure.pmtiles', import.meta.url).href}`;
console.log(tilesUrl);

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

        maplibregl.addProtocol('pmtiles', new Protocol().tile);
        return () => { maplibregl.removeProtocol('pmtiles')};
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
            <Source id='infrastructure' type='vector' url={tilesUrl}>
                <Layer
                    id='transmission-lines'
                    source-layer='transmission'
                    type='line'
                    minzoom={0}
                    paint={{
                        'line-color': '#B54EB2',
                        'line-width': ['interpolate', ['linear'], ['zoom'], 2, 0.5, 10, ['interpolate', ['linear'], ['coalesce', ['get', 'voltage'], 0], 0, 1, 100, 1.8, 800, 4]],
                        'line-opacity': ['interpolate', ['linear'], ['zoom'], 4, 0.6, 8, 1]
                    }}
                    layout={{
                        'line-join': 'round',
                        'line-cap': 'round'
                    }}
                ></Layer>
            </Source>

            {/* CONTROLS */}
            <FullscreenControl />
            <ScaleControl maxWidth={200} style={{borderRadius: '0px', backgroundColor: '#ffffff20'}} />
            <NavigationControl />

        </MapGL>
    )
}