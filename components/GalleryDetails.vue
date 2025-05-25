<template>
    <div class="bg-white rounded-lg shadow-md p-6 mb-8 mt-6">
        <div class="flex justify-between">
            <div>
                <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ gallery.name }}</h1>
                <p class="text-lg text-gray-600 mb-4">

                    <NuxtLink :to="`/models/${gallery.model.id}/${gallery.model.slug}`">
                        Model: {{ gallery.model.name }}
                    </NuxtLink>
                </p>
            </div>


            <div v-if="gallery.referral_1 || gallery.referral_2" class="mb-6">
                <h2 class="text-xl font-semibold text-gray-700 mb-2">External Links</h2>
                <div class="flex justify-between">
                    <a v-if="gallery.referral_1" :href="gallery.referral_1" target="_blank"
                        class="inline-flex items-center px-4 me-2 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition">
                        <span>Referral Link 1</span>
                        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                    </a>
                    <a v-if="gallery.referral_2" :href="gallery.referral_2" target="_blank"
                        class="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition">
                        <span>Referral Link 2</span>
                        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                    </a>
                </div>
            </div>

        </div>


        <div v-if="gallery.tags && gallery.tags.length" class="mb-4">
            <h2 class="text-xl font-semibold text-gray-700 mb-2">Tags</h2>
            <div class="flex flex-wrap gap-2">
                <span v-for="tag in gallery.tags" :key="tag.id"
                    class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {{ tag.tags_id }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    gallery: {
        type: Object,
        required: true
    }
})
</script>