<template>
	<div class="bg-slate-900 text-white h-screen">
		<div class="">
			<div>
				<slot />
			</div>
            <div class="fixed bottom-0 left-0 w-full bg-slate-900 bg-opacity-50 backdrop-blur-md z-50 flex justify-center p-2 items-center">
                <p class="flex items-center space-x-1 text-sm text-slate-400">
                    <img src="/nuxt.svg" class="h-5 w-5 inline-block" alt="Nuxt.js"> 
                    <span>
                        Nuxt web app developed by
                    </span>
                    <a href="https://iwandejong.co.za" class="underline">Iwan de Jong</a>
                </p>
            </div>
		</div>
	</div>
</template>