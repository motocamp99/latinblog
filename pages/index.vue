<template>
   <div v-if="loaded">

      <section class="w-full flex flex-col justify-center items-center p-5">
         <NuxtImg class="mb-5 w-5/12" src="./logo.png" />
         <h4> Discover The Spiciest Latinas</h4>
      </section>

      <section>

         <section class="flex my-12">
            <div class="w-7/12 p-0 h-[600px] flex flex-col justify-center items-start">
               <h2 class="text-4xl font-bold mb-4 ms-4">Models</h2>
               <CarouselSplide :images="modelBanners" />
            </div>
            <div class="w-5/12 my-6">
               <VerticalCarousel :items="modelsArr" :isModel="true" />
            </div>
         </section>

         <section>
            <div class="mb-8 px-6">
               <h2 class="text-2xl font-bold mb-4" >Model Tags</h2>
               <Tags :tags="modelTags" />
            </div>
         </section>

         <section class="flex my-12">

            <div class="w-5/12 my-6">
               <VerticalCarousel :items="postsArr" />
            </div>
            <div class="w-7/12 p-0 h-[600px] flex flex-col justify-center items-start">
               <h2 class="text-4xl font-bold mb-4 txt-center">Magazine</h2>
               <CarouselSplide :images="magazineBanners" />
            </div>
         </section>

         <section>
            <div class="mb-8 px-6">
               <h2 class="text-2xl font-bold mb-4" >Post Tags</h2>
               <Tags :tags="modelTags" />
            </div>
         </section>

      </section>



   </div>
   <div v-else class="flex justify-center items-center h-64">
      <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
         viewBox="0 0 24 24">
         <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
         <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
         </path>
      </svg>
      <span class="sr-only">Cargando...</span>
   </div>

</template>

<script setup>

import { ref, onMounted } from 'vue';
const loaded = ref(false)
const images = [{ image_url: './logo.png' }, { image_url: './logo.png' }]
const modelBanners = ref([])
const magazineBanners = ref([])
const featuredModels = ref([])
const featuredPosts = ref([])
const modelsArr = ref([])
const postsArr = ref()
const postTags = ref([]);
const modelTags = ref([]);


/*
const category = {
   name: "Latin Fans", banner_image: {
      id: "https://latin.dedyn.io/assets/a25dc5a9-4d0b-42d4-b8f2-4996b9bb978f?width=2000&quality=70"

   }
}*/

const bannerImages = ref([])

const fetchBanners = async () => {

   try {
      const url = 'https://latin.dedyn.io/items/banners'
      const response = await fetch(

         url,
         {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            },
         }
      );
      if (!response.ok) throw new Error('Failed to fetch info data');
      const result = await response.json();

      const modelBanners_= result.data.filter(elem=>elem.page==="models")
      const postBanners_= result.data.filter(elem=>elem.page==="magazine")

      modelBanners.value=modelBanners_
      magazineBanners.value=postBanners_

      console.log('resulted model banners', modelBanners)
      console.log('resulted post banners', postBanners)



      //bannerImages.value = result.data
      console.log('resulted banners', bannerImages.value)

   } catch (error) {
      console.error('Error fetching banners:', error);
   }

}

const fetchFeaturedModels = async () => {

   try {
      const query = `
                  { "featured" : 
                          {"_eq" : true} 
                  }
              `
      const response = await fetch(
         `https://latin.dedyn.io/items/models?filter=${query}&fields=*.*`
         ,
         {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            },
         }
      );
      if (!response.ok) throw new Error('Failed to fetch info data');
      const result = await response.json();
      featuredModels.value = result.data
      console.log('featured models', result.data)

   } catch (error) {
      console.error('error with featured models')
      return null
   }
   return null
}

const fetchFeaturedPosts = async () => {

   try {
      const query = `
                  { "featured" : 
                          {"_eq" : true} 
                  }
              `
      const response = await fetch(
         `https://latin.dedyn.io/items/posts?filter=${query}&fields=id,title,description,category.*,date_created,image.*,tags.*`
         ,
         {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            },
         }
      );
      if (!response.ok) throw new Error('Failed to fetch info data');
      const result = await response.json();
      featuredPosts.value = result.data

      console.log('featured posts', result.data)
      return result.data

   } catch (error) {
      console.error('error with featured POSTS')
      return null

   }

   return null

}

const fetchPostTags = async () => {

   try {
      const response = await fetch(

         'https://latin.dedyn.io/items/post_tags?fields=*.*'
         ,
         {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            },
         }
      );
      if (!response.ok) throw new Error('Failed to fetch info data');
      const result = await response.json();
      postTags.value = result.data

   } catch (error) {
      console.error('error with tags', error)
   }

}

const fetchModelTags = async () => {
    try {
        const response = await fetch(
            'https://latin.dedyn.io/items/model_tags?fields=*.*' 
            ,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        if (!response.ok) throw new Error('Failed to fetch info data');
        const result = await response.json();
        modelTags.value = result.data

    } catch (error) {
        console.error('error with tags' , error)
    }
}



const organizePostsByCategory = (posts) => {
   if (!posts || posts.length === 0) return [];

   const categoriesMap = new Map();

   posts.forEach(post => {
      // Handle cases where category might be missing
      const category = post.category

      // Use category name as the unique identifier
      const categoryName = deslugify(category.id)

      // Check if we already have this category in our map
      if (!categoriesMap.has(categoryName)) {
         // Store both the category object and articles array
         categoriesMap.set(categoryName, {
            category: category,  // Store the full category object
            posts: []        // Initialize empty articles array
         });
      }

      // Add the post to the articles array for this category
      categoriesMap.get(categoryName).posts.push(post);
   });

   // Convert to array format that your component expects
   const arr = Array.from(categoriesMap.values()).map(item => ({
      category: item.category.id,  // Just use the name for the category identifier
      posts: item.posts       // The array of articles
   }));

   postsArr.value = arr
};



const organizeModelsByCategory = (models) => {
   if (!models || models.length === 0) return [];

   const categoriesMap = new Map();

   models.forEach(model => {
      // Handle cases where category might be missing
      const category = model.category

      // Use category name as the unique identifier
      const categoryName = deslugify(category.id)

      // Check if we already have this category in our map
      if (!categoriesMap.has(categoryName)) {
         // Store both the category object and articles array
         categoriesMap.set(categoryName, {
            category: category,  // Store the full category object
            models: []        // Initialize empty articles array
         });
      }

      // Add the post to the articles array for this category
      categoriesMap.get(categoryName).models.push(model);
   });

   // Convert to array format that your component expects
   const arr = Array.from(categoriesMap.values()).map(item => ({
      category: item.category.id,  // Just use the name for the category identifier
      models: item.models        // The array of articles
   }));

   modelsArr.value = arr
};


onMounted(async () => {
   await fetchBanners()
   await fetchFeaturedModels()
   await fetchFeaturedPosts()
   await fetchPostTags()
   await fetchModelTags()
   organizePostsByCategory(featuredPosts.value)
   organizeModelsByCategory(featuredModels.value)
   console.log('arrs44', postsArr.value)


   loaded.value = true
})


</script>


<style lang="css" scoped></style>
