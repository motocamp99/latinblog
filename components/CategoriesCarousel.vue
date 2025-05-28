<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import ArticleCard from '@/components/ArticleCard.vue'

const props = defineProps({
    categoryArticlesArray: {
        type: Array as PropType<Array<{
            category: string
            articles: Array<any>
        }>>,
        required: true,
        default: () => []
    }
})
</script>

<template>
    <div>
        <div v-for="categoryGroup in categoryArticlesArray" :key="categoryGroup.category" class="mb-12">
            <div class="flex justify-between items-center mb-6 px-4">
                <h4 class="text-2xl font-semibold capitalize">{{ deslugify(categoryGroup.category)}}</h4>
                <NuxtLink :to="`/category/${slugify(categoryGroup.category.toLowerCase()) }`"
                    class="text-sm font-medium text-primary hover:underline">
                    Ver todos →
                </NuxtLink>
            </div>

            <Carousel class="relative w-full px-4" :opts="{ align: 'start' }">
                <CarouselContent>
                    <CarouselItem v-for="article in categoryGroup.articles" :key="article.title"
                        class="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                        
                        <div class="p-1 h-full">
                            <ArticleCard :article="article" img_height="35vh" :img_width=350 />
                        </div>

                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious class="hidden sm:flex" />
                <CarouselNext class="hidden sm:flex" />
            </Carousel>
        </div>
    </div>
</template>