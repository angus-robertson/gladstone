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
					id="plants"
					
				>
					<Layer
						layer={{
							type: "fill",
							paint: {
								'fill-color': '#fff201',						
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
