import { Component, For, createEffect, mergeProps, onCleanup, splitProps } from 'solid-js'
import { Portal } from 'solid-js/web'
import maplibregl from 'maplibre-gl'
import { TbBuildingFactory, TbBuildingFactory2 } from 'solid-icons/tb'
import { FaSolidMagnifyingGlass } from 'solid-icons/fa'

import { useMapEffect } from '@/libs/solid-maplibrejs'
import { cn, getCategoryColor } from '@/libs/utils'

import projects from '@/assets/data/project-points.json'
import generators from '@/assets/data/generators.json'
import regions from '@/assets/data/regions-points.json'

export const Markers: Component = () => {

	return (
        <>
        <For each={regions.features}>
			{(feature) => {
                return (
				<Marker
					position={
						feature.geometry.coordinates as maplibregl.LngLatLike
					}
					label={feature.properties.name}
					feature={feature}
                    forceOpen
                    minZoom={1}
                    maxZoom={6.5}
				/>
			)}}
		</For>
		<For each={projects.features}>
			{(feature) => {
                return (
				<Marker
					position={
						feature.geometry.coordinates as maplibregl.LngLatLike
					}
					label={feature.properties.name}
					feature={feature}
				/>
			)}}
		</For>
        <For each={generators.features}>
			{(feature) => { 
            if (feature.properties.state == 'QLD') {
                return (
                    <Marker
                        position={
                            feature.geometry.coordinates as maplibregl.LngLatLike
                        }
                        label={feature.properties.name}
                        feature={feature}
                    />
                )}}}
		</For>
        </>
	)
}

type MarkerProps = {
	position: maplibregl.LngLatLike
	label: string
	feature: any
    options?: maplibregl.MarkerOptions | undefined
    forceOpen?: boolean
    minZoom?: number
    maxZoom?: number
}

const Marker: Component<MarkerProps> = (initial) => {
	const [local, options] = splitProps(initial, [
		'position',
		'label',
		'feature',
        'forceOpen',
        'minZoom',
        'maxZoom'
	])
    const props = mergeProps({ minZoom: 6.5, maxZoom: 22}, local)

	let marker: maplibregl.Marker | undefined

	// create marker element
	const el = document.createElement('a')
    el.className = 'bg-[' + getCategoryColor(props.feature.properties.technology) + ']'

    useMapEffect((map) => {
		// create marker
		if (!marker) {
			marker = new maplibregl.Marker({
				...options,
				className: cn('group border-2 absolute text-center rounded-full border-gray-100 cursor-pointer', props.feature.properties.technology == 'region' ? 'w-8 h-8' : 'w-5 h-5'),
				element: el
			})
		}

		// add to map
        marker?.setLngLat(props.position)
        if (map.getZoom() > props.minZoom && map.getZoom() < props.maxZoom) {
            marker.addTo(map)
        }

        createEffect(() => {
            map.on('zoomend', () => {
                const zoom = map.getZoom()
                if (zoom > props.minZoom && zoom < props.maxZoom) {
                    marker?.addTo(map)
                } else {
                    marker?.remove()
                }
            })
        })

        el.addEventListener('click', () => {
            map.flyTo({
                center: marker?.getLngLat(),
                zoom: props.feature.properties.technology == 'region' ? props.maxZoom + 1 : map.getZoom() > 12 ? map.getZoom() : 12
            })
        })

	})

	onCleanup(() => {
		marker?.remove()
	})

    const getIcon = (category: string) => {
        switch(category) {
            case 'region':
                return <FaSolidMagnifyingGlass class='w-4 h-4' />
            case 'distillate':
                return <TbBuildingFactory2 />
            default:
                return <TbBuildingFactory />
        }
    }

	return (
		<Portal
			mount={el}
			ref={(ref) =>
				(ref.className =
					'absolute max-w-full top-1/2 left-1/2 z-10 -translate-y-1/2 -translate-x-1/2 font-bold text-white')
			}
		>
            {}
            {getIcon(props.feature.properties.technology)}
			<div
				class={cn(
					"group-hover:z-[99999] rounded absolute px-2 py-1 text-xs w-max max-w-xs after:w-0 after:h-0 left-1/2 top-full text-white whitespace-normal leading-normal z-10 bg-[#192b3fd9] origin-[center_top] -translate-x-2/4 translate-y-[7px] after:absolute after:content-[' '] after:-ml-1.5 after:border-b-[#192b3fd9] after:border-solid after:border-[6px] after:border-[#192b3f00] after:left-2/4 after:bottom-full",
					'-translate-x-2/4 translate-y-[-7px] origin-[center_bottom] scale-[0.999999999] top-auto bottom-full after:border-t-[#192b3fd9] after:border-b-[#192b3f00] after:top-full after:bottom-auto',
                    props.forceOpen ? 'block' : 'hidden group-hover:block group-focus:block'
				)}
			>
				{props.label}
			</div>
		</Portal>
	)
}