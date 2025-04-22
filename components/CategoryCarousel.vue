<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

const props = defineProps({
    categories: {
        type: Array as PropType<Array<{
            category: string
            category_image: string
            alt: string
            count?: number
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
                <CarouselItem v-for="category in categories" :key="category.category"
                    class="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                    <div class="p-1">
                        <NuxtLink :to="`/category/${category.category}`">
                            <Card class="h-full transition-all hover:shadow-lg">
                                <CardContent class="flex flex-col items-center p-0 aspect-[4/3]">
                                    <!--
                                    <NuxtImg :src="`https://latin.dedyn.io/assets/${category.image.image}`" :alt="category.alt"
                                        class="w-full h-full object-cover rounded-t-lg" loading="lazy"
                                        :modifiers="{ fit: 'cover', quality: 80 }" />-->
                                        <img :src="`https://latin.dedyn.io/assets/${category.image.image}`" alt="">
                                    <div class="p-4 w-full text-center">
                                        <h3 class="text-lg font-semibold capitalize">{{ category.category }}</h3>
                                        <p v-if="category.count" class="text-sm text-gray-500">
                                            {{ category.count }} artículo{{ category.count !== 1 ? 's' : '' }}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </NuxtLink>
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