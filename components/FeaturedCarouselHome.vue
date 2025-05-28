<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import ArticleCard from './ArticleCard.vue'
import ModelCard from './ModelCard.vue'

const props = defineProps({
    items: {
        type: Array as PropType<Array<{
            id: string
            title?: string
            name?: string
            description?: string
            bio?: string
            date_created?: string
            image?: {
                id: string
            }
            category?: {
                id: string
                name?: string
            }
            tags?: Array<{
               post_tags_id: string
               model_tags_id : string
            }>
            country?: string
            age?: string
        }>>,
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
    }
})
</script>

<template>
    <div>
        <Carousel class="relative w-12/12 md:w-9/12 md:ms-12" :opts="{ align: 'start' }">
            <CarouselContent>
                <CarouselItem v-for="item in items" :key="item.id"
                    class="basis-1/2 md:basis-1/2 lg:basis-1/2 xl:basis-1/3">
                    <div class="p-1">
                       
                       <ModelCard v-if="isModel" :model="item" :img_width="600" :img_height="img_height" :minimal="minimal"  /> 
                        <ArticleCard v-else :article="item" :img_width="600" :img_height="img_height" :minimal="minimal"  />
                      
                        <!--{{ item }} --> 
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