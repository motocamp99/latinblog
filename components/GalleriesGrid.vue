<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <!--{{ galleries }}-->
    
    <GalleryCard 
      v-for="gallery in galleries" 
      :key="gallery.id"
      :gallery="gallery"
    />
  </div>
</template>

<script setup>
import GalleryCard from './GalleryCard.vue'

defineProps({
  galleries: {
    type: Array,
    required: true,
    default: () => []
  }
})
</script>