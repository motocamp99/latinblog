<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

const props = defineProps({
    images: {
        type: Array as () => Array<{ src: string, alt?: string, title?: string }>,
        required: true,
        default: () => []
    }
})
</script>

<template>
    <div>
        <Carousel class="relative w-full" :opts="{
            align: 'start',
            skipSnaps: false
        }">
            <CarouselContent>
                <CarouselItem v-for="(image, index) in images" :key="index" class="basis-full">
                    <div class="p-1">
                        <Card class="overflow-hidden">
                            <CardContent class="p-0 aspect-[16/9]">
                                <!--
                                <img :src="image.src" :alt="image.alt || image.title || ''"
                                    class="w-full h-full object-cover">-->

                                <NuxtImg :src="image.src" :alt="image.alt || image.title || ''"
                                    class="w-full h-full object-cover" loading="lazy"
                                    :modifiers="{ fit: 'cover', quality: 80 }" />
                            </CardContent>
                        </Card>
                    </div>
                </CarouselItem>
            </CarouselContent>
            <CarouselPrevious class="hidden sm:flex" />
            <CarouselNext class="hidden sm:flex" />
        </Carousel>
    </div>
</template>

<style scoped>
/*
.aspect-[16/9] {
    aspect-ratio: 16 / 9;
    position: relative;
}*/
</style>