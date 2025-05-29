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
    }, minimal:{
        type:Boolean,
        default : false
    },smallWidth:{
        type: Number,
        default: 12
    },mediumWidth:{
         type: Number,
         default: 10
    }
})
</script>

<template>
    <div > <!--class="flex justify-center"-->
        <Carousel class="relative w-12/12 md:w-10/12 md:ms-12" :opts="{ align: 'start' }"> <!--here i want to set the width from props like w-smallWidth/12 md:w-mediumWidth/12 -->
            <CarouselContent>
                <CarouselItem v-for="item in items" :key="item.id"
                    class="basis-1/2 md:basis-1/2 lg:basis-1/2 xl:basis-1/3">
                    <div class="p-1">
                       <ModelCard v-if="isModel" :model="item" :img_width="600" :img_height="img_height" :minimal="minimal"  /> 
                        <ArticleCard v-else :article="item" :img_width="600" :img_height="img_height" :minimal="minimal"  />
                    </div>
                </CarouselItem>
            </CarouselContent>
            <CarouselPrevious class="flex" />
            <CarouselNext class="flex" />
        </Carousel>
    </div>
</template>

<style scoped>
/* Custom transitions */
.card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
    transform: translateY(-2px);
}
</style>