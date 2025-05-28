<template>

    <Splide id="main-carousel" :options="options" aria-label="Main Gallery">
        <SplideSlide v-for="(image, index) in images" :key="'main-' + index">
            <!--
            <div style="max-height: 60vh; overflow-y: hidden !important;">
                <NuxtImg provider="directus" :src="image.image" />
            </div>-->
            <div style="max-height: 60vh; overflow-y: hidden !important;" >
                <NuxtImg :src="image.image" :alt="image.title" class="w-full h-full object-cover" loading="eager"
                    provider="directus" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                    <div class="text-white">
                        <h1 class="sm:text-7xl md:text-5xl font-bold mb-2">{{ image.title && image.title.length > 50 ?
                            `${image.title.slice(0,
                            50)}...` : title}}</h1>
                        <p v-if="image.subtitle" id="subtitle" class="sm:text-sm md:text-xl opacity-90 lg:mb-14">{{ image.subtitle
                            }}
                        </p>
                    </div>
                </div>
            </div>

        </SplideSlide>
    </Splide>
</template>

<script setup lang="ts">
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import { defineComponent } from 'vue';
import '@splidejs/vue-splide/css';

defineProps({
    images: {
        type: Array as () => Object[],
        required: true,
    },
});

const options = {
    rewind: true,
    gap: '1rem',
};

</script>