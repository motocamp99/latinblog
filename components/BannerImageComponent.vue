<template>
    <div class="relative w-full aspect-[16/9] rounded-lg overflow-hidden shadow-lg" id="main-container">
        <NuxtImg :src="imageUrl" :alt="title" class="w-full h-full object-cover"
            :modifiers="{ fit: 'cover', quality: 80 }" loading="eager" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
            <div class="text-white">
                <h1 class="sm:text-7xl md:text-5xl font-bold mb-2">{{ title && title.length > 50 ? `${title.slice(0, 50)}...` : title}}</h1>
                <p v-if="subtitle" id="subtitle" class="sm:text-sm md:text-xl opacity-90 lg:mb-14">{{ subtitle }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    imageUrl: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        default: ''
    }
})
</script>

<style>
#main-container{
    max-height: 75vh !important;
    overflow: hidden !important;
}

@media (max-width: 768px) {
    #subtitle{
        font-size: 14px;
        /*display: none !important;*/
    }
    h1{
        font-size: 32px;
    }

}

</style>