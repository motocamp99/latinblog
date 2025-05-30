<template>
    <div>
        <Carousel class="carousel-container" :opts="{ align: 'start' }" :style="{
            '--small-width': `${(smallWidth / 12) * 100}%`,
            '--medium-width': `${(mediumWidth / 12) * 100}%`,
            '--large-width': `${(largeWidth / 12) * 100}%`
        }">
            <CarouselContent>
                <CarouselItem 
                    v-for="item in items" 
                    :key="item.id"
                    class="carousel-item"
                    :style="itemSizeStyles"
                >
                    <div class="px-1 md:px-3 ms-3 md:ms-0 ">
                        <ModelCard v-if="isModel" :model="item" :img_width="props.img_width" :img_height="img_height"
                            :minimal="minimal" />
                        <div v-else>

                        <ArticleCardMini v-if="props.minimal" :article="item" :img_width="props.img_width" :img_height="img_height"
                            :minimal="minimal" />

                        <ArticleCard v-else :article="item" :img_width="props.img_width" :img_height="img_height"
                            :minimal="minimal" />
                        </div>
                        
                    </div>
                </CarouselItem>
            </CarouselContent>
            <CarouselPrevious class="flex" />
            <CarouselNext class="flex" />
        </Carousel>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
//import ArticleCard from './ArticleCard.vue'
//import ModelCard from './ModelCard.vue'

interface modelArr {
    type: object[]
}

const props = defineProps({
    items: {
        type: Array as PropType<modelArr[]>,
        required: true,
        default: () => []
    },
    isModel: {
        type: Boolean,
        default: false
    },
    img_width:{
        type: String,
        default: "33vw"
    },
    img_height: {
        type: String,
        default: "15vh"
    },
    minimal: {
        type: Boolean,
        default: false
    },
    // Container width props
    smallWidth: {
        type: Number,
        default: 12,
        validator: (value: number) => value >= 1 && value <= 12
    },
    mediumWidth: {
        type: Number,
        default: 10,
        validator: (value: number) => value >= 1 && value <= 12
    },
    largeWidth: {
        type: Number,
        default: 8,
        validator: (value: number) => value >= 1 && value <= 12
    },
    // Items per view props
    itemsSm: {
        type: Number,
        default: 2,
        validator: (value: number) => value >= 1 && value <= 6
    },
    itemsMd: {
        type: Number,
        default: 2,
        validator: (value: number) => value >= 1 && value <= 6
    },
    itemsLg: {
        type: Number,
        default: 4,
        validator: (value: number) => value >= 1 && value <= 6
    },
    itemsXl: {
        type: Number,
        default: 4,
        validator: (value: number) => value >= 1 && value <= 6
    }
})

// Generate dynamic basis styles based on items per view props
const itemSizeStyles = computed(() => ({
    '--basis-sm': `${100/props.itemsSm}%`,
    '--basis-md': `${100/props.itemsMd}%`,
    '--basis-lg': `${100/props.itemsLg}%`,
    '--basis-xl': `${100/props.itemsXl}%`
}))
</script>

<style scoped>
.carousel-container {
    width: var(--small-width);
    position: relative;
}

@media (min-width: 768px) {
    .carousel-container {
        width: var(--medium-width);
        margin-left: 3rem; /* equivalent to md:ms-12 */
    }
}

@media (min-width: 1024px) {
    .carousel-container {
        width: var(--large-width);
    }
}

.carousel-item {
    flex: 0 0 var(--basis-sm);
    padding: 0.25rem; /* equivalent to p-1 */
}

@media (min-width: 768px) {
    .carousel-item {
        flex-basis: var(--basis-md);
    }
}

@media (min-width: 1024px) {
    .carousel-item {
        flex-basis: var(--basis-lg);
    }
}

@media (min-width: 1280px) {
    .carousel-item {
        flex-basis: var(--basis-xl);
    }
}
</style>