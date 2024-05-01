import { createSignal } from 'solid-js'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Layer, Map, NavigationControl, ScaleControl, Source } from 'solid-maplibre'


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
					id="plants"
					
				>
					<Layer
          layer={{
            type: "circle",
						filter: [
							'any',
							['==', ['get', 'FuelCategory'], 'Renewable'],
							[
								'all',
								['==', ['get', 'fuel_type'], 'Hydrogen'],
								['==', ['get', 'state'], 'QLD']
							]
						],
						paint: {
							'circle-color': [
								'case',
								['==', ['get', 'fuel_type'], 'Solar'],
								'#fff201',
								['==', ['get', 'fuel_type'], 'Wind'],
								'#4db802',
								['==', ['get', 'fuel_type'], 'Bioenergy'],
								'#39b1b7',
								['==', ['get', 'fuel_type'], 'Battery storage'],
								'#c43b3f',
								['==', ['get', 'fuel_type'], 'Hydro'],
								'#3548a0',
								['==', ['get', 'fuel_type'], 'Hydrogen'],
								'#08f70a',
								'#000000'
							],
							'circle-opacity': 0.5,
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
