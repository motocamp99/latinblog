<template>
  <div v-if="loaded && model" class="w-9/12 mx-auto p-6 bg-white rounded-lg shadow-md">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row gap-6 mb-8">
      <!-- Image placeholder - you would replace this with actual image display -->
      <div class="w-full md:w-1/3 bg-gray-200 rounded-lg aspect-square flex items-center justify-center">
        <span v-if="!model.image" class="text-gray-500">No Image</span>
        <img v-else :src="`https://latin.dedyn.io/assets/${model.image.id}`" :alt="model.image.title" class="w-full h-full object-cover rounded-lg">
      </div>
      
      <!-- Basic Info -->
      <div class="w-full md:w-2/3">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ model.name }}</h1>
        
        <div class="flex items-center gap-4 mb-4">
          <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {{ model.category.id }}
          </span>
          <span v-if="model.active" class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            Active
          </span>
          <span v-else class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
            Inactive
          </span>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p class="text-sm text-gray-500">Age</p>
            <p class="font-medium">{{ calculateAge(model.age) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Country</p>
            <p class="font-medium">{{ model.country }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Tattoos</p>
            <p class="font-medium">{{ model.tattoos || 'None' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Piercings</p>
            <p class="font-medium">{{ model.piercings || 'None' }}</p>
          </div>
        </div>
        
        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mb-4">
          <span 
            v-for="tag in model.tags" 
            :key="tag.id"
            class="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
          >
            {{ tag.tags_id }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Bio Section -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-800 mb-3">About</h2>
      <p class="text-gray-700 whitespace-pre-line">{{ model.bio }}</p>
    </div>
    
    <!-- Social Links -->
    <div v-if="model.social_links && model.social_links.length" class="mb-8">
      <h2 class="text-xl font-semibold text-gray-800 mb-3">Social Media</h2>
      <div class="flex gap-4">
        <a 
          v-for="link in model.social_links" 
          :key="link.id"
          :href="getSocialUrl(link)"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <span class="text-gray-700 capitalize">{{ link.social_platform }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
    
    <!-- Metadata -->
    <div class="border-t border-gray-200 pt-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
        <div>
          <p>Created</p>
          <p class="text-gray-700">{{ formatDate(model.date_created) }}</p>
        </div>
        <div>
          <p>Updated</p>
          <p class="text-gray-700">{{ formatDate(model.date_updated) }}</p>
        </div>
        <div>
          <p>Status</p>
          <p class="text-gray-700 capitalize">{{ model.status }}</p>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Loading State -->
  <div v-else class="flex justify-center items-center h-64">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  model: {
    type: Object,
    required: true
  },
  loaded: {
    type: Boolean,
    required: true
  }
});

// Calculate age from birthdate
const calculateAge = (birthdate) => {
  if (!birthdate) return 'Unknown';
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Format date to readable format
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Generate social media URLs
const getSocialUrl = (link) => {
  const platform = link.social_platform.toLowerCase();
  const username = link.slug;
  
  const platforms = {
    twitter: `https://twitter.com/${username}`,
    instagram: `https://instagram.com/${username}`,
    facebook: `https://facebook.com/${username}`,
    tiktok: `https://tiktok.com/@${username}`,
    // Add more platforms as needed
  };
  
  return platforms[platform] || `#`;
};
</script>