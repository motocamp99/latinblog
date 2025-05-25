<template>
  <div>
    <!-- Image Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div 
        v-for="(image, index) in images" 
        :key="index"
        class="break-inside-avoid-column"
      >
        <div 
          class="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          @click="openLightbox(index)"
        >
          <NuxtImg
            :src="image.url"
            :fallback="image.fallback || '/placeholder.jpg'"
            loading="lazy"
            class="w-full h-auto object-cover"
            :alt="`Gallery image ${index + 1}`"
          />
        </div>
      </div>
    </div>

    <!-- Lightbox Component -->
    <vue-easy-lightbox 
      :visible="visible" 
      :imgs="lightboxImages" 
      :index="lightboxIndex" 
      @hide="handleHide" 
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import VueEasyLightbox from 'vue-easy-lightbox'

const props = defineProps({
  images: {
    type: Array,
    required: true,
    default: () => []
  }
})

// Lightbox state
const visible = ref(false)
const lightboxIndex = ref(0)

// Prepare images for lightbox
const lightboxImages = computed(() => {
  return props.images.map(image => ({
    src: image.url,
    title: '' // Optional title
  }))
})

const openLightbox = (index) => {
  lightboxIndex.value = index
  visible.value = true
}

const handleHide = () => {
  visible.value = false
}
</script>