<template>
    <div v-if="loaded">

        <section class="mb-3 md:mb-12 px-4 lg:px-24 mt-12" v-if="modelBanners">
            <CarouselSplide :images="modelBanners" />
        </section>

        <section class="mb-3 md:mb-12 px-4 lg:px-24 mt-12">
            <h2 class="text-2xl font-bold mb-6">Featured Models</h2>
            <FeaturedCarousel :items="featuredModels" :isModel="true" img_height="40vh" />
        </section>


        <section class="mb-3 md:mb-12 px-4 lg:px-24">
            <h4 class="text-2xl font-semibold capitalize">Categorías</h4>
            <CategoryCarousel :categories="categories" :isModel="true" />
        </section>

        
         <div class="w-full flex justify-center mb-3 my-12 md:my-6 lg:px-11">
            <VerticalCarousel :items="modelsArr" :isModel="true" :smallWidth=12 :mediumWidth=11 :largeWidth=11 :itemsXl="3" />
        </div>
        

        <section class="px-4 lg:px-24">
            <div v-if="allModels.length > 0">


                <div class="mb-8">
                    <h2 class="text-2xl font-bold mb-4">Etiquetas</h2>
                    <Tags :tags="tags" @tag-selected="handleTagSelect" />
                </div>


                <h2 class="text-2xl font-bold mb-6">Todos Los Artículos</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                    <ModelCard v-for="model in allModels" :key="model.name" :model="model" class="w-full h-full" />

                </div>

                <nav aria-label="Page navigation" class="mt-8 mb-12">
                    <ul class="flex justify-center lg:justify-start flex-wrap gap-1">
                        <li>
                            <Button variant="outline" @click="changePage(1)" :disabled="currentPage === 1">
                                Primero
                            </Button>
                        </li>
                        <li>
                            <Button variant="outline" @click="changePage(currentPage - 1)"
                                :disabled="currentPage === 1">
                                Anterior
                            </Button>
                        </li>
                        <li v-for="page in visiblePages" :key="page">
                            <Button variant="outline" @click="changePage(page)" :class="{
                                'bg-primary text-primary-foreground': page === currentPage,
                            }">
                                {{ page }}
                            </Button>
                        </li>
                        <li>
                            <Button variant="outline" @click="changePage(currentPage + 1)"
                                :disabled="currentPage === totalPages">
                                Siguiente
                            </Button>
                        </li>
                        <li>
                            <Button variant="outline" @click="changePage(totalPages)"
                                :disabled="currentPage === totalPages">
                                Último
                            </Button>
                        </li>
                    </ul>
                </nav>
            </div>

            <div v-else class="text-center py-12">
                <p class="text-gray-500">No se encontraron artículos</p>
            </div>
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

const allModels = ref([])
const modelBanners = ref([])
const loaded = ref(false)
const totalModels = ref(0)
const categories = ref([])
const featuredModels = ref([])
const tags = ref([])
const modelsArr = ref([])

const ITEMS_PER_PAGE = 5
const currentPage = ref(1);
const MAX_VISIBLE_PAGES = 5;



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

        const modelBanners_ = result.data.filter(elem => elem.page === "models")
        modelBanners.value = modelBanners_
        console.log('resulted model banners', modelBanners)


    } catch (error) {
        console.error('Error fetching banners:', error);
    }

}


const fetchCategories = async () => {

    try {
        const response = await fetch(

            'https://latin.dedyn.io/items/models_categories?fields=*.*'
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
        categories.value = result.data

        console.log('resulted categories', result.data)

    } catch (error) {
        console.error('Error fetching categories:');
    }

}

const countModels = async () => {
    try {
        const response = await fetch(
            'https://latin.dedyn.io/items/models?aggregate[count]=*',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) throw new Error('Failed to count posts');

        const result = await response.json();
        totalModels.value = result.data[0].count;
        console.log('total posts value', totalModels.value)

    } catch (error) {
        console.error('Error counting model count');
    }
};



const fetchModels = async (page = 1) => {
    const offset = (page - 1) * ITEMS_PER_PAGE;

    try {
        const response = await fetch(
            `https://latin.dedyn.io/items/models?filter[status][_eq]=published&fields=*.*,image&limit=${ITEMS_PER_PAGE}&offset=${offset}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) throw new Error('Failed to fetch posts');

        const result = await response.json();
        allModels.value = result.data;
        currentPage.value = page;

        console.log('total models value', allModels.value)

    } catch (error) {
        console.error('Error fetching models', error);
    }
};

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
        return result.data

    } catch (error) {
        console.error('error with featured models')
        return null

    }

    return null

}


const fetchTags = async () => {

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
        tags.value = result.data

        console.log('all tags', tags.value)

    } catch (error) {
        console.error('error with tags', error)
    }

}

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




const totalPages = computed(() => Math.ceil(totalModels.value / ITEMS_PER_PAGE));

const visiblePages = computed(() => {
    const pages = [];
    let startPage = 1;
    let endPage = totalPages.value;

    if (totalPages.value > MAX_VISIBLE_PAGES) {
        const half = Math.floor(MAX_VISIBLE_PAGES / 2);
        startPage = Math.max(1, currentPage.value - half);
        endPage = Math.min(totalPages.value, currentPage.value + half);

        if (endPage - startPage + 1 < MAX_VISIBLE_PAGES) {
            if (currentPage.value < totalPages.value / 2) {
                endPage = Math.min(totalPages.value, startPage + MAX_VISIBLE_PAGES - 1);
            } else {
                startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
            }
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return pages;
});

// Change page handler
const changePage = (page) => {
    if (page > 0 && page <= totalPages.value && page !== currentPage.value) {
        fetchModels(page);
        window.scrollTo({ top: 3000, behavior: 'smooth' });
    }

    console.log('page', page)
};




onMounted(async () => {

    await fetchBanners()
    await fetchCategories()
    await fetchTags()
    await countModels()
    await fetchModels()
    await fetchFeaturedModels()
    organizeModelsByCategory(featuredModels.value)

    loaded.value = true

})

</script>

<style scoped></style>