<template>

    <div>
        <!-- Hero Section -->

        <div v-if="loaded">

            <section class="mb-6">
                <TagBanner :tag="tag" />
            </section>


            <section class="px-4 lg:px-24">
                
                <h2 class="text-2xl font-bold mb-6">Artículos Sugeridos (Tag: <span> {{ tagName }} </span>) </h2>
                <section class="mb-6">
                    <FeaturedPostsCarousel :posts="featuredArticles" />
                </section>
                

                <div v-if="allArticles.length > 0">

                    <!--
                    <div class="mb-8">
                        <h2 class="text-2xl font-bold mb-4">Etiquetas</h2>
                        <Tags :tags="tags" @tag-selected="handleTagSelect" />
                    </div>-->


                    <h2 class="text-2xl font-bold mb-6">Todos Los Artículos ({{ totalPosts }}) </h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        
                        <ArticleCard v-for="article in allArticles" :key="article.title" :article="article"
                            class="w-full h-full" />
                    
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

    </div>

</template>


<script setup>

const route = useRoute();
const tagSlug = ref(route.params.tagSlug[0]);
const tagName = ref(deslugify(route.params.tagSlug[0]));
const categoryName = ref(deslugify(route.params.categorySlug))
const categorySlug = route.params.categorySlug
const tag = ref({})
const allArticles = ref([]);
const loaded = ref(false);
const featuredArticles = ref([]);

const currentPage = ref(1);
const ITEMS_PER_PAGE = 1;
const MAX_VISIBLE_PAGES = 5;
const totalPosts = ref(0)

//const tagSlug

import { ref, onMounted } from 'vue';


const fetchTag = async (tagSlug) => {

    try {
        const response = await fetch(

            `https://latin.dedyn.io/items/tags?fields=*.*&filter={"slug":{"_eq" : "${tagSlug}"  }}` //working
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

        tag.value = result.data[0]
        tag.value.description = categoryName.value
        //console.log('resulted tag', tag.value)

    } catch (error) {
        console.log('error with tag')
    }

}

const countCategoryTagPosts = async (categorySlug, tagName) => {
    try {
        
        const query = `{
                        "category": { 
                                "slug":{
                                    "_eq" : "${categorySlug}"
                                    }
                             },
                        
                        "_and": [
                            {"tags":{
                             "_some": {
                                "tags_id" : {"_eq" : "${tagName}" } }  
                                } 
                            }]
                        
                        }`
        

        const response = await fetch(
            `https://latin.dedyn.io/items/posts?aggregate[countDistinct]=id&fields=*.*&filter=${query}`,
     
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) throw new Error('Failed to count posts');

        const result = await response.json();
        
        totalPosts.value=result.data[0].countDistinct.id 
        console.log('total posts', totalPosts.value)
 

    } catch (error) {
        console.error('Error counting posts count');
    }
};



const fetchPostsByCategoryAndTag = async (categorySlug, tagName, page = 1) => {

    const offset = (page - 1) * ITEMS_PER_PAGE;

    const query = `{
                    "category": { 
                            "slug":{
                                "_eq" : "${categorySlug}"
                                }
                            },
                        
                    "_and": [
                        {"tags":{
                            "_some": {
                            "tags_id" : {"_eq" : "${tagName}" } }  
                            }
                        }]
                    }`

    const response = await fetch(

        `https://latin.dedyn.io/items/posts?fields=*.*&filter=${query}&limit=${ITEMS_PER_PAGE}&offset=${offset}` //working

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
    allArticles.value = result.data
    currentPage.value = page;

    //console.log(slug)
    console.log('resulted category tag posts2', result.data)

    return result

}

const fetchFeaturedPostsByTagName = async (tagName) => {

//  const query=`{ "category": { "name":{"_eq" : "${category}" }  } ,"_and" : [{"featured" : {"_eq" : true} }] }` //working

const query = `{ "tags": { "_some": {"tags_id" : {"_eq" : "${tagName}" } }  } 
          ,"_and" :
         [
          {"featured" : 
                  {"_eq" : true} 
          }
         ] 
      }`

const response = await fetch(
    `https://latin.dedyn.io/items/posts?fields=*.*&filter=${query}`
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
featuredArticles.value=result.data
//allArticles.value = result.data

console.log('featured by tags', result.data)

}

// Pagination computed properties
const totalPages = computed(() => Math.ceil(totalPosts.value / ITEMS_PER_PAGE));

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
        fetchPostsByCategoryAndTag(categorySlug, tagName.value, page);
        window.scrollTo({ top: 1000, behavior: 'smooth' });
    }
};


onMounted(async () => {

    await Promise.all([
        //fetchInit(),

    ]);

    

    //console.log('Category Articles', categoryArticles.value)
    //console.log('tag params', params.value.tagSlug[0])
    //console.log('tagSlug', tagSlug.value)
    await fetchTag(tagSlug.value)
    await countCategoryTagPosts(categorySlug, tagName.value)
    await fetchPostsByCategoryAndTag(categorySlug, tagName.value)
    await fetchFeaturedPostsByTagName(tagName.value)
    //console.log('catslug', categorySlug)
    console.log('totalposts', totalPosts.value)
    loaded.value = true;

})

</script>


<style lang="css" scoped></style>
