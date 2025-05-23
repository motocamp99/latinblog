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
                <CarouselItem v-for="category in categories" :key="category.slug ? category.slug : slugify(category.name)"
                    class="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                    <div class="p-1">
                        <NuxtLink :to="category.slug ? `/category/${category.slug}` : `/category/${slugify(category.name)}`  ">
                            <Card class="h-full transition-all hover:shadow-lg">
                                <CardContent class="flex flex-col items-center p-0 aspect-[4/3]">
                                    
                                    <NuxtImg :src="`${category.category_image.filename_disk}`" :alt="category.alt"
                                        class="w-full h-full object-cover rounded-t-lg" loading="lazy" width=300 quality=70
                                        :modifiers="{ fit: 'cover'}" provider="directus"/>
                                   

                                    <div class="p-4 w-full text-center">
                                        <h3 class="text-lg font-semibold capitalize">{{ category.name }}</h3>
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