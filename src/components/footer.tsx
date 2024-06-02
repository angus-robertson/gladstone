import { Component, ParentComponent } from 'solid-js'

import {
	RiBusinessCreativeCommonsFill,
	RiLogosGithubFill
} from 'solid-icons/ri'

const FooterLink: ParentComponent<{ href?: string }> = (props) => {
	return (
		<a
			href={props.href}
			class="border-b border-dashed hover:border-solid border-white cursor-pointer"
		>
			{props.children}
		</a>
	)
}

export const Footer: Component = () => {
	return (
		<footer class="flex z-100 bottom-0 left-0 right-0 text-white text-xs bg-[#143980] justify-between px-4 py-1">
			<div class="flex relative items-center">
				<div class="mr-4">
					<strong>v0.0.1</strong>
				</div>
				<div class="space-x-1">
					Sources:&nbsp
					<FooterLink href="/#"></FooterLink>
				</div>
			</div>
			<div class="flex relative items-center space-x-1">
				<a href="https://github.com/angus-robertson/netzeromap">
					<RiLogosGithubFill class="w-4 h-4" />
				</a>
				<a>
					<RiBusinessCreativeCommonsFill class="w-4 h-4" />
				</a>
                <FooterLink href="#">About</FooterLink>
			</div>
		</footer>
	)
}

// TODO: add tooltips
