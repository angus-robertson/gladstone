import { Component, createEffect, createSignal } from 'solid-js'

import { FaSolidArrowsRotate } from 'solid-icons/fa'
import { useMapEffect } from '@/libs/solid-maplibrejs'

type ControlBarProps = {
}

export const ControlBar: Component<ControlBarProps> = () => {
	const [zoom, resetZoom] = createSignal<boolean>(false)

	const handleReset = () => {
		resetZoom(true)
	}

	useMapEffect((map) => {
		createEffect(() => {
			if (zoom()) {
				map.flyTo({
					center: [132.7, -27.7],
					zoom: 4}
				)
				resetZoom(false)
			}
		})
	})

	return (
		<div class="absolute ml-2 mt-2 flex flex-col">
			<div class="flex bg-white border border-gray-200">
				<button 
					class='h-8 p-2 items-center justify-center flex text-sm'
					onClick={handleReset}
				>
					<FaSolidArrowsRotate class="h-4 w-4 mr-2" />
					<span>Reset</span>
				</button>
			</div>
		</div>
	)
}