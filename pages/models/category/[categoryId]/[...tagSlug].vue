<template>
    <div>
        <div v-if="loaded">

            <section class="mb-6 mt-6">
                <TagBanner :tag="tag" />
            </section>


            <section class="px-4 lg:px-24">

                <h2 class="text-2xl font-bold mb-6">Featured Models (Tag: <span> {{ tagName }} </span>) </h2>

                <section class="mb-6">
                    <FeaturedCarousel :isModel="true" :items="featuredModels" />
                </section>

                <div v-if="allModels.length > 0">

                    <h2 class="text-2xl font-bold mb-6">All Models ({{ totalModels }}) </h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <ModelCard v-for="model in allModels" :key="model.id" :model="model" class="w-full h-full" />
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
                    <p class="text-gray-500">No Articles Found</p>
                </div>

            </section>

            <section class="px-4 lg:px-24 mb-4 md:mb-12">
                <h4 class="text-2xl font-semibold capitalize">More Categories</h4>
                <CategoryCarousel :categories="categories" :isModel="true" />
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

    </div>

</template>


<script setup>

const route = useRoute();
const tagSlug = ref(route.params.tagSlug[0]);

const tagName = ref(deslugify(route.params.tagSlug[0]));
const categoryName = ref(deslugify(route.params.categoryId))
const categorySlug = route.params.categoryId
const tag = ref({})
const allModels = ref([]);
const loaded = ref(false);
const featuredModels = ref([]);
const categories = ref([]);

const currentPage = ref(1);
const ITEMS_PER_PAGE = 1;
const MAX_VISIBLE_PAGES = 5;
const totalModels = ref(0)

//const tagSlug

import { ref, onMounted } from 'vue';


const fetchTag = async (tagSlug) => {

    try {
        const response = await fetch(

            `https://latin.dedyn.io/items/model_tags?fields=*.*&filter={"id":{"_eq" : "${tagSlug}"  }}` //working
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

        console.log('resulted tag', result.data)

        tag.value = result.data[0]
        tag.value.description = categoryName.value
        console.log('resulted tag', tag.value)

    } catch (error) {
        console.log('error with tag')
    }

}

const countCategoryTagModels = async (categorySlug, tagSlug) => {
    try {

        const query = `{
                        "category": { 
                                "id":{
                                    "_eq" : "${categorySlug}"
                                    }
                             },
                        
                        "_and": [
                            {"tags":{
                             "_some": {
                                "model_tags_id" : {"_eq" : "${tagSlug}" } }  
                                } 
                            }]
                        
                        }`


        const response = await fetch(
            `https://latin.dedyn.io/items/models?aggregate[countDistinct]=id&fields=*.*&filter=${query}`,

            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) throw new Error('Failed to count posts');

        const result = await response.json();

        totalModels.value = result.data[0].countDistinct.id
        console.log('total posts', totalModels.value)


    } catch (error) {
        console.error('Error counting posts count');
    }
};



const fetchModelsByCategoryAndTag = async (categorySlug, tagSlug, page = 1) => {

    const offset = (page - 1) * ITEMS_PER_PAGE;

    const query = `{
                    "category": { 
                            "id":{
                                "_eq" : "${categorySlug}"
                                }
                            },
                        
                    "_and": [
                        {"tags":{
                            "_some": {
                            "model_tags_id" : {"_eq" : "${tagSlug}" } }  
                            }
                        }]
                    }`

    const response = await fetch(

        `https://latin.dedyn.io/items/models?fields=*.*&filter=${query}&limit=${ITEMS_PER_PAGE}&offset=${offset}` //working

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
    allModels.value = result.data
    currentPage.value = page;

    //console.log(slug)
    console.log('resulted category tag models', result.data)

    return result

}

const fetchFeaturedModelsByTagName = async (tagSlug) => {

    try {
        const query = `{ "tags": { "_some": {"model_tags_id" : {"_eq" : "${tagSlug}" } }  } 
          ,"_and" :
         [
          {"featured" : 
                  {"_eq" : true} 
          }
         ] 
      }`

        const response = await fetch(
            `https://latin.dedyn.io/items/models?fields=*.*&filter=${query}`
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
        //allArticles.value = result.data

        console.log('featured models by tags', result.data)

    } catch (error) {
        console.error('error with tags', error)
    }
}

const fetchCategories = async () => {

    try {
        const response = await fetch(

            'https://latin.dedyn.io/items/models_categories?fields=*.*,category_image.*'
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

        console.log('resulted model categories', result.data)

    } catch (error) {
        console.error('Error fetching categories:' , error);
    }

}


// Pagination computed properties
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
        fetchModelsByCategoryAndTag(categorySlug, tagSlug.value, page);
        window.scrollTo({ top: 1000, behavior: 'smooth' });
    }
};


onMounted(async () => {

    await fetchTag(tagSlug.value)
    await fetchFeaturedModelsByTagName(tagSlug.value)
    await countCategoryTagModels(categorySlug, tagSlug.value)
    await fetchModelsByCategoryAndTag(categorySlug, tagSlug.value)
    await fetchCategories()

    /*
    
    */

    loaded.value = true;

})

</script>


<style lang="css" scoped></style>
