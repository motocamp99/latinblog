<template>
    <div class="gallery-container">
        <!-- Gallery Grid -->
        <div class="gallery-grid" :style="{ '--columns': picturesPerRow }">
            <div 
                v-for="(image, index) in images" 
                :key="index"
                class="gallery-item"
                @click="openLightbox(index)"
            >
                <NuxtImg 
                    :src="'https://latin.dedyn.io/assets/' + image" 
                    :alt="`Gallery image ${index + 1}`" 
                    quality="80"
                    class="gallery-image" 
                />
            </div>
        </div>

        <!-- Lightbox Component -->
        <vue-easy-lightbox :visible="visible" :imgs="lightboxImages" :index="index" @hide="handleHide" />
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


const lightboxImages = computed(() => {
  return images.map(id => ({
    src: `https://latin.dedyn.io/assets/${id}`, // Adjust extension if needed
    title: '' // Optional title
  }));
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

<style scoped>
.gallery-container {
    width: 100%;
}

.gallery-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(var(--columns), 1fr);
    margin: 1.25rem 0;
}

.gallery-item {
    overflow: hidden;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    cursor: pointer;
    transition: box-shadow 0.3s ease;
}

.gallery-item:hover {
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.gallery-image {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.3s ease;
}

.gallery-item:hover .gallery-image {
    transform: scale(1.05);
}
</style>