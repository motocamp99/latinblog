<template>
    <div>
        <div v-for="(category, catIndex) in imageCategoryArrays" :key="catIndex" class="mb-10">
            <h2 class="category-title text-xl font-semibold mb-2 ps-0 md:ps-5">{{ category.name }}</h2>

            <Splide :options="options" aria-label="Image Category Carousel">
                <SplideSlide v-for="(chunk, slideIndex) in chunkImages(category.images)" :key="slideIndex">
                    <div class="flex flex-wrap gap-2 justify-between image-carousel-grid">
                        <div v-for="(image, indexInChunk) in chunk" :key="image.url + slideIndex + indexInChunk"
                            class="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-zoom-in image-tile-container"
                            @click="openLightbox(category.name, getAbsoluteImageIndex(category, slideIndex, indexInChunk))">

                           <!-- {{ image }} -->

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
    flex-wrap: wrap;
    gap: 0.5rem;
   /*justify-content: space-between;*/
   justify-content: start;

}

.image-tile-container {
    height: 400px;
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis:auto;
    position: relative;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: zoom-in;
    
}

.image-tile-container:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    /* Tailwind: hover:shadow-lg */
}

/* Styles for the NuxtImg component */
.image-tile {
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;

}

@media only screen and (max-width: 600px) {

    .image-tile-container {
        max-width: 100%;
    }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
    .image-tile-container {
        max-width: 31%;
    }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
    .image-tile-container {
        max-width: 25%;
    }
    .image-carousel-grid {
        justify-content: space-around;
    }

}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
    .image-tile-container {
        max-width: 18%;
    }
    .image-carousel-grid {
        justify-content: space-between;
    }

}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
    
    .image-carousel-grid {
        justify-content: start;
        padding-left: 5vw;
    }
     .image-tile-container {
       max-width: 15%;
    }
    .category-title{
        padding-left: 5vw;
    }

}

@media only screen and (min-width: 1400px) {
    .image-carousel-grid {
        justify-content: start;
        padding-left: 1vw;
    }
     .image-tile-container {
       max-width: 20%;
    }
    .category-title{
        padding-left: 1vw;
    }

}


</style>