<template>
    <div class="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
        <!--{{ image }}-->
        <NuxtImg :src="image.url" :alt="image.alt || image.gallery?.name || 'latina model'"
            :fallback="image.fallback_url || '/placeholder.jpg'" class="w-full h-64 object-cover" loading="lazy" />
       
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">

            <NuxtLink v-if="image.gallery" :to="`/gallery/${image.gallery.id}/${slugify(image.gallery.name)}`"
                class="text-white font-semibold text-md hover:underline">
                {{ image.gallery?.name }}
            </NuxtLink>
      
            <div v-if="image.tags && image.tags.length > 0" class="flex flex-wrap gap-2 mt-2">
                <span v-for="(tag, index) in image.tags" :key="index"
                    class="px-2 py-1 bg-white/20 text-white text-xs rounded-full backdrop-blur-sm">
                    {{ tag.tags_id }}
                </span>
            </div>
        </div>
        
    </div>
</template>

<script setup>

const props = defineProps({
    image: {
        type: Object,
        required: true,
        validator: (image) => {
            return image.url && image.gallery?.id && image.gallery?.name
        }
    }
})
</script>