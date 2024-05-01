import { createSignal } from 'solid-js'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Map, NavigationControl, ScaleControl } from 'solid-maplibre'

function App() {
	const [zoom, setZoom] = createSignal<number>(4)

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
				<ScaleControl />
				<NavigationControl />
			</Map>
		</>
	)
}

export default App
