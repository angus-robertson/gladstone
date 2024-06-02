import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs))
}

export const getCategoryColor = (category: string) => {
	switch (category) {
		case 'battery':
			return '#d7153a' // red
		case 'biogas':
			return '#8cdbe5' // teal
		case 'biomass':
			return '#8cdbe5' // teal
		case 'geothermal':
			return '#000000'
		case 'hydro':
			return '#3548a0' // dark blue
		case 'hydrogen':
			return '#6610f2' // indigo
		case 'offshore wind':
			return '#00aa45' // green
		case 'onshore wind':
			return '#00aa45' // green
		case 'pumped hydro':
			return '#3548a0'  // dark blue
		case 'solar PV':
			return '#faaf05' // yellow
		case 'solar thermal':
			return '#faaf05' // yellow
		case 'coal':
			return '#001d34'
		case 'distillate':
			return '#d912ae'
		case 'gas':
			return '#001d34'
		default:
			return '#495054'
	}
}