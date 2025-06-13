<template>
    <div>
        <div v-for="(category, catIndex) in imageCategoryArrays" :key="catIndex" class="mb-10">
            <h2 class="text-xl font-semibold mb-2">{{ category.name }}</h2>

            <Splide :options="splideOptions" aria-label="Image Gallery Carousel">

                <SplideSlide v-for="(galleryItem, index) in category.galleries" :key="galleryItem.id">

                    <div class="group relative rounded-lg shadow-md overflow-hidden bg-white
                               hover:shadow-xl transition-all duration-300 cursor-pointer h-full
                               w-64 md:w-72 " @click="openLightbox(category.name, index)">

                        <NuxtImg :src="`https://${baseCDN}/${galleryItem.cover_image.replace(/^1280\//, '460/')}`"
                            :alt="galleryItem.title || 'gallery image'" class="w-full h-full object-cover"
                            loading="lazy" />

                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent 
                                   opacity-0 group-hover:opacity-100 transition-opacity 
                                   flex flex-col justify-end p-3">
                            <NuxtLink :to="`/gallery/${galleryItem.id}/${slugify(galleryItem.title)}`"
                                class="text-white font-bold text-sm hover:underline" @click.stop>
                                {{ galleryItem.title }}
                            </NuxtLink>

                            <div v-if="galleryItem.tags?.length" class="flex flex-wrap gap-1 mt-1">
                                <TagsComponent :tags="galleryItem.tags" :isImage="true" />
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
// import TagsComponent from '@/components/TagsComponent.vue';
import { ref, computed } from 'vue';

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

// Lightbox logic remains the same
const visible = ref(false);
const lightboxIndex = ref(0);
const activeCategory = ref('');

const openLightbox = (categoryName, absoluteIndex) => {
    // Note: The index calculation is simpler now
    activeCategory.value = categoryName;
    lightboxIndex.value = absoluteIndex;
    visible.value = true;
};

const handleHide = () => {
    visible.value = false;
};

const lightboxImages = computed(() => {
    const category = props.imageCategoryArrays.find(cat => cat.name === activeCategory.value);
    return category ? category.galleries.map(item => `https://${props.baseCDN}/${item.cover_image}`) : [];
});

// NEW: Powerful, responsive Splide options
const splideOptions = {
    type: 'loop', // Use 'loop' for a continuous feel, or 'slide'
    /*drag: 'free', // Allows for more fluid, partial dragging*/
    focus: 'center', // Can be nice, centers the active slide
    gap: '1.25rem',
    arrows: true,
    pagination: false,
    autoWidth: true, // Let each slide determine its own width
    breakpoints: {
        640: { // Mobile
            gap: '0.75rem',
        },
        1024: { // Tablet
            gap: '1rem',
        },
    },
};

</script>

<style scoped>
.gallery-grid {
    display: grid;
    gap: 1.25rem;
    padding: 0 1rem;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.gallery-grid .group {
    width: 100%;
    height: 100%;
}

.gallery-grid .group .image-tile {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>