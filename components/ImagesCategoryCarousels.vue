<template>
    <div>
        <div v-for="(category, catIndex) in imageCategoryArrays" :key="catIndex" class="mb-10">
            <h2 class="text-xl font-semibold mb-2">{{ category.name }}</h2>

            <Splide :options="options" aria-label="Image Category Carousel">
                <SplideSlide v-for="(chunk, slideIndex) in chunkImages(category.images)" :key="slideIndex">
                    <div class="flex flex-wrap gap-2 justify-between image-carousel-grid">
                        <div v-for="(image, indexInChunk) in chunk" :key="image.url + slideIndex + indexInChunk"
                            class="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-zoom-in image-tile-container"
                            @click="openLightbox(category.name, getAbsoluteImageIndex(category, slideIndex, indexInChunk))">

                            <NuxtImg :src="`https://${baseCDN}/${image.url.replace(/^1280\//, '460/')}`"
                                :alt="image.alt || image.gallery?.title || 'model image'"
                                :fallback="image.fallback_url || '/placeholder.jpg'" class="image-tile"
                                loading="lazy" />

                            <div
                                class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2">
                                <NuxtLink v-if="image.gallery"
                                    :to="`/gallery/${image.gallery.id}/${slugify(image.gallery.title)}`"
                                    class="text-white font-semibold text-xs hover:underline">
                                    {{ image.gallery.title }}
                                </NuxtLink>
                                <div v-if="image.tags?.length" class="flex flex-wrap gap-1 mt-1">
                                    <TagsComponent :tags="image.tags" :isImage="true" />
                                </div>
                            </div>
                        </div>
                        <template v-if="chunk.length > 0">
                            <div v-for="n in calculateDummyCount(chunk.length, 5)" :key="`dummy-${slideIndex}-${n}`"
                                class="image-tile-dummy"></div>
                        </template>
                    </div>
                </SplideSlide>
            </Splide>
        </div>

        <VueEasyLightbox :visible="visible" :imgs="lightboxImages" :index="lightboxIndex" @hide="handleHide" />
    </div>
</template>

<script setup>
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';
import VueEasyLightbox from 'vue-easy-lightbox';
//import TagsComponent from '@/components/TagsComponent.vue';
import { ref, computed } from 'vue';

const CHUNK_SIZE = 10;
const IMAGES_PER_ROW_IDEAL = 5;

const props = defineProps({
    imageCategoryArrays: {
        type: Array,
        required: true
    },
    baseCDN: {
        type: String,
        required: true
    }
});

const visible = ref(false);
const lightboxIndex = ref(0);
const activeCategory = ref('');

function chunkImages(images) {
    const chunks = []
    for (let i = 0; i < images.length; i += CHUNK_SIZE) {
        chunks.push(images.slice(i, i + CHUNK_SIZE))
    }
    return chunks
}

const calculateDummyCount = (currentChunkLength, idealPerRow) => {
    if (currentChunkLength === 0) return 0;

    if (currentChunkLength <= idealPerRow) {
        return idealPerRow - currentChunkLength;
    }

    const remainder = currentChunkLength % idealPerRow;
    if (remainder > 0) {
        return idealPerRow - remainder;
    }

    return 0;
};


const getAbsoluteImageIndex = (category, slideIndex, indexInChunk) => {
    return (slideIndex * CHUNK_SIZE) + indexInChunk;
};

const openLightbox = (categoryName, absoluteIndex) => {
    activeCategory.value = categoryName;
    lightboxIndex.value = absoluteIndex;
    visible.value = true;
};

const handleHide = () => {
    visible.value = false;
};

const lightboxImages = computed(() => {
    const category = props.imageCategoryArrays.find(cat => cat.name === activeCategory.value);
    return category ? category.images.map(img => `https://${props.baseCDN}/${img.url}`) : [];
});

const options = {
    rewind: true,
    gap: '1rem',
    arrows: true,
    pagination: false,
    perPage: 1,
};

function slugify(text) {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}
</script>

<style scoped>
/* Main container for images within a Splide slide */
.image-carousel-grid {
    display: flex;
    /* Tailwind: flex */
    flex-wrap: wrap;
    /* Tailwind: flex-wrap */
    gap: 0.5rem;
    /* Tailwind: gap-2 */
    justify-content: space-between;
    /* Tailwind: justify-between */
}

/* Base styles for the image tile container (not directly related to hover functionality) */
/* The 'group' class for Tailwind's hover variant is applied directly in the template. */
.image-tile-container {
    height: 400px;
    /* Fixed height for all containers */

    flex-grow: 1;
    /* Allow items to grow and fill available space */
    flex-shrink: 1;
    /* Allow items to shrink if needed (controlled by min-width) */
    flex-basis: auto;
    /* Allows width to be determined by content initially, then stretch */

    /*min-width: 180px;*/
    /* Minimum width for images. Adjust as needed. */

    position: relative;
    /* CRITICAL for absolute positioning of the overlay */
    border-radius: 0.5rem;
    /* Tailwind: rounded-lg */
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    /* Tailwind: shadow-md */
    overflow: hidden;
    /* CRITICAL: Ensures the overlay is clipped to the container's bounds and rounded corners */
    transition: all 0.3s ease;
    /* Tailwind: transition-all duration-300 */
    cursor: zoom-in;
    /* Tailwind: cursor-zoom-in */
}

.image-tile-container:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    /* Tailwind: hover:shadow-lg */
}

/* Styles for the NuxtImg component */
.image-tile {
    height: 100%;
    /* Tailwind: h-full */
    width: 100%;
    /* Tailwind: w-full */
    object-fit: cover;
    /* Tailwind: object-cover */
    object-position: center top;
    /* Tailwind: object-top (used center top for precision) */
    display: block;
    /* Tailwind: block */
}

/* Styles for the dummy elements used to fill the last row */
.image-tile-dummy {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: auto;
    min-width: 180px;

    height: 0;
    margin: 0;
    padding: 0;
    visibility: hidden;
    pointer-events: none;
}

/* Removed all explicit custom CSS definitions for Tailwind utility classes
    like .absolute, .inset-0, .opacity-0, .group-hover\:opacity-100, etc.
    These should solely be managed by Tailwind's compiled CSS.
    
    The classes are already applied directly in the HTML template.
*/
</style>