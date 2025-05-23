<template>
    <div>
        <!-- Gallery Grid -->
        <div class="grid gap-4 my-5" :style="{ gridTemplateColumns: `repeat(${picturesPerRow}, 1fr)` }">
            <div v-for="(image, index) in parsedImages" :key="index"
                class="overflow-hidden rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
                @click="openLightbox(index)">
              
                <NuxtImg :src="image" :alt="`Gallery image ${index + 1}`" quality="80"
                    class="w-full h-auto block hover:scale-105 transition-transform duration-300" />
            </div>
        </div>

        <!-- Lightbox Component -->
        <vue-easy-lightbox :visible="visible" :imgs="parsedImages" :index="index" @hide="handleHide" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import VueEasyLightbox from 'vue-easy-lightbox';

const { images, picturesPerRow } = defineProps({
    images: {
        type: [Array, String],
        required: true,
    },
    picturesPerRow: {
        type: Number,
        default: 3,
    },
});

const parsedImages = computed(() => {
    if (typeof images === 'string') {
        return JSON.parse(images);
    }
    return images;
});

// Lightbox state
const visible = ref(false);
const index = ref(0);

const openLightbox = (idx) => {
    index.value = idx;
    visible.value = true;
};

const handleHide = () => {
    visible.value = false;
};
</script>