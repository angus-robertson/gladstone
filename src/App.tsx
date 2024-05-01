import { createSignal } from 'solid-js'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Layer, Map, NavigationControl, ScaleControl, Source } from '@/libs/solid-maplibrejs'


function App() {
	const [zoom] = createSignal<number>(4)

	return (
		<>
			<Map
				style={{
					width: '100vw',
					height: '100vh'
				}}
				options={{
					center: [132.7, -27.7],
					style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
					zoom: zoom()
				}}
			>
				<Source
					source={{
						type: "geojson",
						data: "https://angus-robertson.github.io/netzeromap/data/projects.geojson"
					}}
					id="project-fill"
					
				>
					<Layer
						layer={{
							type: "fill",
							minzoom: 7,
							paint: {
								'fill-color': ['case',
									['==', ['get', 'technology'], 'solar PV'], '#fff201',
									['==', ['get', 'technology'], 'onshore wind'], '#4db802',
									['==', ['get', 'technology'], 'pumped hydro'], '#3548a0',
									'#000000'
								],
								'fill-opacity': 0.3,
								'fill-outline-color': ['case',
									['==', ['get', 'technology'], 'solar PV'], '#fff201',
									['==', ['get', 'technology'], 'onshore wind'], '#4db802',
									['==', ['get', 'technology'], 'pumped hydro'], '#3548a0',
									'#000000'
								],						
								}
							}}				
					/>
					
				</Source>
				<Source
					source={{
						type: "geojson",
						data: "https://angus-robertson.github.io/netzeromap/data/project-points.geojson"
					}}
					id="project-labels"
					
				>
					<Layer
						layer={{
							type: "symbol",
							minzoom: 7,
							layout: {
								'text-field': ['get', 'name'],
								'text-size': ['interpolate', ['linear'], ['zoom'], 6, 10, 18, 24],
							},
							paint: {
								"text-halo-width": 4,
								"text-halo-blur": 2,
								"text-halo-color": "rgba(230, 230, 230, 1)"					
								}
							}}				
					/>
					<Layer
						layer={{
							type: "circle",
							maxzoom: 10,
							paint: {
								'circle-color': ['case',
									['==', ['get', 'technology'], 'solar PV'], '#fff201',
									['==', ['get', 'technology'], 'onshore wind'], '#4db802',
									['==', ['get', 'technology'], 'pumped hydro'], '#3548a0',
									'#000000'
								],
								'circle-opacity': 0.3,
								'circle-stroke-color': 'black',
								'circle-stroke-width': 0.5,
								'circle-stroke-opacity': 0.6
								}
							}}				
					/>
					
				</Source>

				<ScaleControl />
				<NavigationControl />
			</Map>
		</>
	)
}

export default App
