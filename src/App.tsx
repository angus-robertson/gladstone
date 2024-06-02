import 'maplibre-gl/dist/maplibre-gl.css'

import { Layer, Map, NavigationControl, ScaleControl, Source } from '@/libs/solid-maplibrejs'
import { getCategoryColor } from '@/libs/utils'

import { Footer } from '@/components/footer'
import { ControlBar } from '@/components/control-bar'
import { Markers } from '@/components/map/markers'

function App() {
	const style = new URL('../style.json', import.meta.url)
	const projects = new URL('../data/projects.json', import.meta.url)
	const regions = new URL('../data/regions.json', import.meta.url)
	
	return (
		<>
			<Map
				style={{
					width: '100vw',
					height: '100vh'
				}}
				options={{
					center: [132.7, -27.7],
					style: style.href,
					zoom: 4
				}}
			>
				{/** REGIONS */}
				<Source
					source={{
						type: "geojson",
						data: regions.href
					}}
					id="region-boundaries"
				>
					<Layer 
						id='region-boundaries-fill'
						layer={{
							type: "fill",
							paint: {
								'fill-color': "#cdd3d6",
								'fill-opacity': ['interpolate', ['exponential', 1.96], ['zoom'], 0, 0.5, 7.8, 0.5, 9.942, 0.3, 12.196, 0.15]
							}
						}}
					/>
					<Layer 
						id='region-boundaries-lines'
						layer={{
							type: "line",
							paint: {
								'line-color': "#495054",
								'line-width': ['interpolate', ['linear'], ['zoom'], 7, 2, 22, 6],
								'line-opacity': ['interpolate', ['exponential', 1.96], ['zoom'], 0, 0.5, 7.8, 0.5, 9.942, 0.3, 12.196, 0.15]
							}
						}}
					/>
				</Source>

				{/** PROJECTS & FACILITIES */}		
				<Source
					source={{
						type: "geojson",
						data: projects.href
					}}
					id="project-fill"
					
				>
					<Layer
						id='project-fill'
						layer={{
							type: "fill",
							minzoom: 7,
							paint: {
								'fill-color': ['case',
									['==', ['get', 'technology'], 'battery'], getCategoryColor('battery'),
									['==', ['get', 'technology'], 'biogas'], getCategoryColor('biogas'),
									['==', ['get', 'technology'], 'biomass'], getCategoryColor('biomass'),
									['==', ['get', 'technology'], 'geothermal'], getCategoryColor('geothermal'),
									['==', ['get', 'technology'], 'hydro'], getCategoryColor('hydro'),
									['==', ['get', 'technology'], 'hydrogen'], getCategoryColor('hydrogen'),
									['==', ['get', 'technology'], 'offshore wind'], getCategoryColor('offshore wind'),
									['==', ['get', 'technology'], 'onshore wind'], getCategoryColor('onshore wind'),
									['==', ['get', 'technology'], 'pumped hydro'], getCategoryColor('pumped hydro'),
									['==', ['get', 'technology'], 'solar PV'], getCategoryColor('solar PV'),
									['==', ['get', 'technology'], 'solar thermal'], getCategoryColor('solar thermal'),
									['==', ['get', 'technology'], 'coal'], getCategoryColor('coal'),
									['==', ['get', 'technology'], 'distillate'], getCategoryColor('distillate'),
									['==', ['get', 'technology'], 'gas'], getCategoryColor('gas'),
									'#000000'
								],
								'fill-opacity': ['interpolate', ['exponential', 1.96], ['zoom'], 7.2, 0, 7.8, 0.5, 16, 0],					
								}
							}}				
					/>

					<Layer
					id='project-line'
						layer={{
							type: "line",
							minzoom: 5,
							paint: {
								'line-color': ['case',
									['==', ['get', 'technology'], 'battery'], getCategoryColor('battery'),
									['==', ['get', 'technology'], 'biogas'], getCategoryColor('biogas'),
									['==', ['get', 'technology'], 'biomass'], getCategoryColor('biomass'),
									['==', ['get', 'technology'], 'geothermal'], getCategoryColor('geothermal'),
									['==', ['get', 'technology'], 'hydro'], getCategoryColor('hydro'),
									['==', ['get', 'technology'], 'hydrogen'], getCategoryColor('hydrogen'),
									['==', ['get', 'technology'], 'offshore wind'], getCategoryColor('offshore wind'),
									['==', ['get', 'technology'], 'onshore wind'], getCategoryColor('onshore wind'),
									['==', ['get', 'technology'], 'pumped hydro'], getCategoryColor('pumped hydro'),
									['==', ['get', 'technology'], 'solar PV'], getCategoryColor('solar PV'),
									['==', ['get', 'technology'], 'solar thermal'], getCategoryColor('solar thermal'),
									['==', ['get', 'technology'], 'coal'], getCategoryColor('coal'),
									['==', ['get', 'technology'], 'distillate'], getCategoryColor('distillate'),
									['==', ['get', 'technology'], 'gas'], getCategoryColor('gas'),
									'#000000'
								],
								'line-opacity': ['interpolate', ['exponential', 1.96], ['zoom'], 7.2, 0, 7.8, 1],
								'line-width': ['interpolate', ['linear'], ['zoom'], 8, 2, 12, 3.5]					
								}
							}}				
					/>
					
				</Source>

				{/** MARKERS */}	
				<Markers />

				{/** CONTROLS */}
				<ControlBar />
				<ScaleControl />
				<NavigationControl />
			</Map>
			<Footer />
		</>
	)
}

export default App
