import maplibregl, { GeoJSONFeature, LngLat, StyleSpecification } from 'maplibre-gl';
import { Ref, useCallback, useEffect, useRef, useState } from 'react';
import { FullscreenControl, Layer, Map as MapGL, MapRef, NavigationControl, ScaleControl, Source } from 'react-map-gl/maplibre';
import { Protocol } from 'pmtiles';
import { Search } from './SearchMenu';
import { PopupInfo } from 'src/utils/types';
import { MapGeoJSONFeature } from 'react-map-gl';

const tilesUrl = `pmtiles://${new URL('../assets/infrastructure.pmtiles', import.meta.url).href}`;

interface ProjectMapProps {
    setPopupInfo: (popupInfo: PopupInfo | null) => void;
}

export const ProjectMap: React.FC<ProjectMapProps> = ({setPopupInfo}): React.JSX.Element => {
    const [mapStyle, setMapStyle] = useState<StyleSpecification | undefined>({
        version: 8,
        sources: {},
        layers: [],
        "glyphs": "http://fonts.openmaptiles.org/{fontstack}/{range}.pbf"
    });
    const [zoom, ] = useState<number>(4);
    const actualMapRef = useRef<MapRef | undefined>(undefined);

    // Search
    const [searchString, setSearchString] = useState<string>('');
    const [searchPoints, setSearchPoints] = useState< Map<string, GeoJSONFeature> >(new Map());
    const [selected, setSelected] = useState<string | undefined>(undefined);

    const setDefaultStyle = () => {
        fetch('https://basemaps.cartocdn.com/gl/positron-gl-style/style.json').then(res => res.text()).then(style => setMapStyle(JSON.parse(style)));
    };

    useEffect( () => {
        setDefaultStyle();

        maplibregl.addProtocol('pmtiles', new Protocol().tile);
        return () => { maplibregl.removeProtocol('pmtiles')};
    }, []);

    useEffect( () => {
        if (selected) {
            const feature = searchPoints.get(selected);
            let coords: LngLat | undefined;
        
            if (feature!.geometry.type == 'Point') {
                coords = new LngLat(feature!.geometry.coordinates[0] as number, feature!.geometry.coordinates[1] as number);
            }

            if (coords) {
                actualMapRef!.current!.flyTo({center: coords, speed: 0.9, zoom: 14});
                setPopupInfo({
                    properties: feature!.properties,
                    longitude: coords.lng,
                    latitute: coords.lat,
                    onClose: () => setPopupInfo(null)
                });
            }
        }
    }, [selected]);

    const setPopupFeature = useCallback( 
        (lngLat: LngLat, features: MapGeoJSONFeature[] | undefined) => {
            const clickableFeatures = features?.filter( feature => feature.source == 'qld-plants' );
            if (clickableFeatures && clickableFeatures[0]) {
                const feature = clickableFeatures[0];
                setPopupInfo({
                    properties: feature!.properties,
                    longitude: lngLat.lng,
                    latitute: lngLat.lat,
                    onClose: () => setPopupInfo(null)
                })
            } else {
                setPopupInfo(null);
            }
        }, [setPopupInfo]);

    const mapReference = useCallback( (mapRef: MapRef) => {
        if (mapRef != null) {
            actualMapRef.current = mapRef;

            mapRef.on('click', event => {
                const features = mapRef.queryRenderedFeatures(event.point) as MapGeoJSONFeature[];
                setPopupFeature(event.lngLat, features);
            });

            mapRef.on('mouseenter', 'qld-plants', () => {mapRef.getCanvas().style.cursor = 'pointer'});
            mapRef.on('mouseleave', 'qld-plants', () => {mapRef.getCanvas().style.cursor = ''});

            // set search points to current source data
            // TODO: maybe want to refactor this so search isn't linked to viewport?
            mapRef.on('sourcedata', event => {
                if (event.isSourceLoaded && event.sourceId == 'qld-plants' || 'hydrogen-plants') {
                    const points = mapRef.querySourceFeatures('qld-plants', {
                        sourceLayer: 'qld-plants',
                        filter: ['any', 
                                    ['==', ['get', 'FuelCategory'], 'Renewable'],
                                    ['all',
                                        ['==', ['get', 'fuel_type'], 'Hydrogen'],
                                        ['==', ['get', 'state'], 'QLD']
                                    ]
                                ]
                    });
                    const uniquePoints = new Map<string, GeoJSONFeature>();
                    points.forEach(feature => {
                        uniquePoints.set(feature.properties!.project_name.toLowerCase(), feature);
                    })
                    setSearchPoints(uniquePoints);
                }
            });
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
                    filter={['!=', ['get', 'asset_type'], 'UG']}
                    paint={{
                        'line-color':   ['step', ['/',['to-number', ['get', 'operating_voltage']], 1000],
                                            '#7A7A85',
                                            9.99, '#6E97B8',
                                            24.99, '#55B555',
                                            51.99, '#B59F10',
                                            131.99, '#B55D00',
                                            219.99, '#C73030',
                                            309.99, '#B54EB2',
                                            549.99, '#00C1CF'
                                        ],
                        'line-width':   ['interpolate', ['linear'], ['zoom'], 
                                            2, 0.5, 
                                            10, ['interpolate', ['linear'], ['/',['to-number', ['get', 'operating_voltage']], 1000], 
                                                    0, 1, 
                                                    100, 1.8, 
                                                    800, 4]],
                        'line-opacity': ['interpolate', ['linear'], ['zoom'], 4, 0.6, 8, 1]
                    }}
                    layout={{
                        'line-join': 'round',
                        'line-cap': 'round'
                    }}
                />
                <Layer
                    id='transmission-lines-underground'
                    source-layer='transmission'
                    type='line'
                    filter={['==', ['get', 'asset_type'], 'UG']}
                    minzoom={0}
                    paint={{
                        'line-color':   ['step', ['/',['to-number', ['get', 'operating_voltage']], 1000],
                                            '#7A7A85',
                                            9.99, '#6E97B8',
                                            24.99, '#55B555',
                                            51.99, '#B59F10',
                                            131.99, '#B55D00',
                                            219.99, '#C73030',
                                            309.99, '#B54EB2',
                                            549.99, '#00C1CF'
                                        ],
                        'line-width':   ['interpolate', ['linear'], ['zoom'], 
                                            2, 0.5, 
                                            10, ['interpolate', ['linear'], ['/',['to-number', ['get', 'operating_voltage']], 1000], 
                                                    0, 1, 
                                                    100, 1.8, 
                                                    800, 4]],
                        'line-opacity': ['interpolate', ['linear'], ['zoom'], 4, 0.6, 8, 1],
                        'line-dasharray': [3, 2]
                    }}
                    layout={{
                        'line-join': 'round',
                        'line-cap': 'round'
                    }}
                />
                <Layer 
                    id="transmission-lines-labels"
                    source-layer='transmission'
                    type="symbol"
                    minzoom={9}
                    layout={{
                        'text-field':   ['concat', ['/', ['to-number', ['get', 'operating_voltage']], 1000], 'kV'],
                        'text-font': ["Noto Sans Regular"],
                        'symbol-placement': 'line',
                        'symbol-spacing': 400,
                        'text-size': ['interpolate', ['linear'], ['zoom'], 11, 10, 18, 13],
                        'text-offset': [0, 1],
                        'text-max-angle': 10
                    }}
                    paint= {{
                        'text-halo-width': 4,
                        'text-halo-blur': 2,
                        'text-halo-color': 'rgba(230, 230, 230, 1)'
                    }}
                />
            </Source>

            <Source
                id='qld-plants'
                type='geojson'
                data={new URL('../../data/projects/plants.geojson', import.meta.url).href}
            >
                <Layer
                    id='qld-plants'
                    type='circle'
                    filter={['any', 
                                ['==', ['get', 'FuelCategory'], 'Renewable'],
                                ['all',
                                    ['==', ['get', 'fuel_type'], 'Hydrogen'],
                                    ['==', ['get', 'state'], 'QLD']
                                ]
                            ]}
                    paint={{
                        'circle-color': ['case', 
                                            ['==', ['get', 'fuel_type'], 'Solar'], '#fff201',
                                            ['==', ['get', 'fuel_type'], 'Wind'], '#4db802',
                                            ['==', ['get', 'fuel_type'], 'Bioenergy'], '#39b1b7',
                                            ['==', ['get', 'fuel_type'], 'Battery storage'], '#c43b3f',
                                            ['==', ['get', 'fuel_type'], 'Hydro'], '#3548a0',
                                            ['==', ['get', 'fuel_type'], 'Hydrogen'], '#08f70a',
                                            '#000000'
                                        ],
                        'circle-opacity': 0.5,
                        'circle-stroke-color': 'black', 
                        'circle-stroke-width': 0.5,
                        "circle-stroke-opacity": 0.6
                    }}
                />

            </Source>

            {/* CONTROLS */}
            <FullscreenControl />
            <ScaleControl maxWidth={200} style={{borderRadius: '0px', backgroundColor: '#ffffff20'}} />
            <NavigationControl />

            <Search
                searchString={searchString}
                stringSetter={setSearchString}
                searchPoints={searchPoints}
                selectedSetter={setSelected}
            />

        </MapGL>
    )
}