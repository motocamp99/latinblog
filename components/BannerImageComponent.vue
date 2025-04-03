<template>
    <div class="relative w-full aspect-[16/9] rounded-lg overflow-hidden shadow-lg" id="main-container">
        <NuxtImg :src="imageUrl" :alt="title" class="w-full h-full object-cover"
            :modifiers="{ fit: 'cover', quality: 80 }" loading="eager" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
            <div class="text-white">
                <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">{{ title }}</h1>
                <p v-if="subtitle" class="text-lg sm:text-xl opacity-90">{{ subtitle }}</p>
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

</style>