
<template>
    <Carousel orientation="vertical" class="relative w-full py-6 h-[50vh] md:h-[50vh] lg:h-[50vh] xl:h-[75vh]" :opts="{
        align: 'start',
    }">
        <CarouselContent v-if="isModel" class="-mt-1 h-[55vh] md:h-[50vh] lg:h-[50vh] xl:h-[75vh]"> <!--h-[50vh] md:h-[50vh] lg:h-[50vh] xl:h-[75vh]-->

            <CarouselItem  v-for="obj in props.items" :key="obj.category" class="p-1 md:basis-1/2">
                <div class="p-1">
                     <h5 class="font-semibold capitalize ms-6"> {{ deslugify(obj.category) }}  </h5>
                    <FeaturedCarouselHome :items="obj.models" :isModel="true" :minimal="true" />
                </div>
            </CarouselItem>

        </CarouselContent>

        <CarouselContent v-else class="-mt-1 h-[50vh] md:h-[50vh] lg:h-[50vh] xl:h-[75vh]">

            <CarouselItem  v-for="obj in props.items" :key="obj.category" class="p-1 md:basis-1/2">
                <div class="p-1">
                     <h5 class="font-semibold capitalize ms-6"> {{ deslugify(obj.category) }}  </h5>
                    <FeaturedCarouselHome :items="obj.posts" :minimal="true" />
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
    },isModel :{
        type:Boolean,
        default:false
    }
})

/*
const props = defineProps<{
  models: object[]
}>()

*/
</script>
