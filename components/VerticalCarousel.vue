<template>
    <Carousel orientation="vertical" class="w-full h-[60vh] md:h-[50vh] lg:h-[50vh] xl:h-[75vh]"
        :opts="{ align: 'start', }">
        <CarouselContent v-if="isModel" class="mt-1 h-[60vh] md:h-[50vh] lg:h-[50vh] xl:h-[75vh]">
            <!--h-[50vh] md:h-[50vh] lg:h-[50vh] xl:h-[75vh]-->

            <CarouselItem v-for="obj in props.items" :key="obj.category" class="p-1 md:basis-1/2">
                <div class="p-1">
                    <NuxtLink :to="`/models/category/${obj.category}`">
                         <h5 class="font-semibold capitalize ms-2 md:ms-12"> {{ deslugify(obj.category) }} </h5>
                    </NuxtLink>
                    <FeaturedCarouselHome :items="obj.models" :isModel="true" :img_width="props.img_width"
                        :img_height="props.img_height" :minimal="props.minimal" :smallWidth="props.smallWidth"
                        :mediumWidth="props.mediumWidth" :largeWidth="props.largeWidth" :itemsSm="props.itemsSm"
                        :itemsMd="props.itemsMd" :itemsLg="props.itemsLg" :itemsXl="props.itemsXl" />
                </div>
            </CarouselItem>

        </CarouselContent>

        <CarouselContent v-else class="mt-1 h-[60vh] md:h-[50vh] lg:h-[50vh] xl:h-[75vh]">

            <CarouselItem v-for="obj in props.items" :key="obj.category" class="basis-1/2">
                <div>
                    <NuxtLink :to="`/posts/category/${obj.category}`">
                         <h5 class="font-semibold capitalize ms-2 md:ms-12"> {{ deslugify(obj.category) }} </h5>
                    </NuxtLink>
                    <FeaturedCarouselHome :items="obj.posts" :img_width="props.img_width" :img_height="props.img_height"
                        :minimal="props.minimal" :smallWidth="props.smallWidth" :mediumWidth="props.mediumWidth"
                        :largeWidth="props.largeWidth" :itemsSm="props.itemsSm" :itemsMd="props.itemsMd"
                        :itemsLg="props.itemsLg" :itemsXl="props.itemsXl" />
                </div>
            </CarouselItem>

        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
    </Carousel>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import type { PropType } from 'vue'


interface modelArr {
    type: object[]
}

const props = defineProps({
    items: {
        type: Array as PropType<modelArr[]>,
        required: true,
        default: () => []
    }, isModel: {
        type: Boolean,
        default: false
    },
    img_width: {
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
    smallWidth: {
        type: Number,
        default: 3,
        validator: (value: number) => value >= 1 && value <= 12
    },
    mediumWidth: {
        type: Number,
        default: 5,
        validator: (value: number) => value >= 1 && value <= 12
    },
    largeWidth: {
        type: Number,
        default: 5,
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

/*
const props = defineProps<{
  models: object[]
}>()

*/
</script>
