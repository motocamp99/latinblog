<template>
    <div>
        <Carousel class="carousel-container" :opts="{ align: 'start' }" :style="{
            '--small-width': `${(smallWidth / 12) * 100}%`,
            '--medium-width': `${(mediumWidth / 12) * 100}%`,
            '--large-width': `${(largeWidth / 12) * 100}%`
        }">
            <CarouselContent>
                <CarouselItem v-for="item in items" :key="item.id"
                    class="basis-1/2 md:basis-1/2 lg:basis-1/2 xl:basis-1/5">
                    <div class="p-1">
                        <ModelCard v-if="isModel" :model="item" :img_width="600" :img_height="img_height"
                            :minimal="minimal" />
                        <ArticleCard v-else :article="item" :img_width="600" :img_height="img_height"
                            :minimal="minimal" />
                    </div>
                </CarouselItem>
            </CarouselContent>
            <CarouselPrevious class="flex" />
            <CarouselNext class="flex" />
        </Carousel>
    </div>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import ArticleCard from './ArticleCard.vue'
import ModelCard from './ModelCard.vue'

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
    img_height: {
        type: String,
        default: "15vh"
    },
    minimal: {
        type: Boolean,
        default: false
    },
    smallWidth: {
        type: Number,
        default: 12
    },
    mediumWidth: {
        type: Number,
        default: 10
    },
    largeWidth: {
        type: Number,
        default: 8
    }
})
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
</style>