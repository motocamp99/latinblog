<template>
  <NuxtLink 
    :to="`/gallery/${gallery.id}/${slugify(gallery.name)}`"
    class="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
  >
    <!-- Gallery Cover Image -->
    <div class="relative aspect-[4/3] w-full overflow-hidden">
      <NuxtImg
        :src="gallery.image.url"
        :alt="gallery.name || 'Gallery image'"
        :fallback="gallery.image.fallback_url || '/placeholder.jpg'"
        class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
      />
    </div>

    <!-- Gallery Info -->
    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-2 truncate">{{ gallery.name }}</h3>
      
      <!-- Tags -->
      <div v-if="gallery.tags && gallery.tags.length" class="flex flex-wrap gap-2">
        <span 
          v-for="(tag, index) in gallery.tags" 
          :key="index"
          class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
        >
          {{ tag.tags_id }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>

const props = defineProps({
  gallery: {
    type: Object,
    required: true,
    validator: (gallery) => {
      return gallery.id && gallery.name && gallery.image
    }
  }
})
</script>