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
        default: "40vh"
    }, minimal:{
        type:Boolean,
        default : false
    }
})
</script>

<template>
    <div>
        <Carousel class="relative w-full px-1 md:px-6" :opts="{ align: 'start' }">
            <CarouselContent>
                <CarouselItem v-for="item in items" :key="item.id"
                    class="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/4">
                    <div class="p-1">
                       <!--{{ item }}-->
                       
                       <ModelCard v-if="isModel" :model="item" img_width="600" :img_height="img_height" :minimal="minimal"  /> 
                        <ArticleCard v-else :article="item" img_width="600" :img_height="img_height" :minimal="minimal"  />
                        
                    </div>
                </CarouselItem>
            </CarouselContent>
            <CarouselPrevious class="hidden sm:flex" />
            <CarouselNext class="hidden sm:flex" />
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