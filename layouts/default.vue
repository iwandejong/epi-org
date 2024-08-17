<template>
	<div class="bg-slate-900 text-white h-screen">
		<div class="h-full">
			<header class="sticky top-0">
				<Navbar />
			</header>
			<div>
				<slot />
			</div>
		</div>
	</div>
</template>