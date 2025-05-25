<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    <GalleryImageCard 
      v-for="(image, index) in images" 
      :key="image.url + index"
      :image="image"
      class="hover:z-10 hover:scale-105 transition-transform duration-200"
    />
  </div>
</template>

<script setup>
//import GalleryImageCard from './GalleryImageCard.vue'

defineProps({
  images: {
    type: Array,
    required: true,
    default: () => []
  }
})
</script>