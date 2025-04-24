<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

/*help me here */


const props = defineProps({
    posts: {
        type: Array as PropType<Array<{
            id: string
            title: string
            description?: string
            date_created?: string
            image?: {
                id: string
            }
            category?: {
                name: string
            }
            tags?: Array<{
                tags_id: string
            }>
        }>>,
        required: true,
        default: () => []
    }
})
</script>

<template>
    <div>
        <Carousel class="relative w-full" :opts="{ align: 'start' }">
            <CarouselContent>
                <CarouselItem v-for="post in posts" :key="post.id"
                    class="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/3">
                    <div class="p-1">
                        <ArticleCard :article="post" />
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