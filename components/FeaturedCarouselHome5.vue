<template>
    <div>
        <Carousel class="carousel-container" :opts="{ align: 'start' }" :style="{
            '--small-width': `${(smallWidth / 12) * 100}%`,
            '--medium-width': `${(mediumWidth / 12) * 100}%`,
            '--large-width': `${(largeWidth / 12) * 100}%`
        }">
            <CarouselContent>
                <CarouselItem v-for="item in items" :key="item.id"
                    :class="itemSizeClasses">
                    items xl {{ props.itemsXl }}
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
import { computed } from 'vue'
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

// Generate dynamic basis classes based on items per view props
const itemSizeClasses = computed(() => [
    `basis-1/${props.itemsSm}`,
    `md:basis-1/${props.itemsMd}`,
    `lg:basis-1/${props.itemsLg}`,
    `xl:basis-1/${props.itemsXl}`
])
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