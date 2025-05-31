<template>
    <div>

        <div v-if="loaded">
            <section class="mt-6 mb-6">
                <!--{{ category }}-->
                <CategoryBanner :category="category" />
            </section>
            
            <section class="px-4 lg:px-24">

                <h2 class="text-2xl font-bold mb-6">Artículos Sugeridos</h2>
                <section class="mb-6">
                    <!--{{ featuredPosts}}-->

                    <FeaturedCarousel :items="featuredPosts"  />
                </section>

                
                <div v-if="allArticles.length > 0">
                    <!--{{ allArticles }}-->
                    
                   
                   
                    <div class="mb-8">
                        <h2 class="text-2xl font-bold mb-4">Etiquetas</h2>
                        <!--{{ tags }}--> 
                       <Tags :tags="tags" @tag-selected="handleTagSelect" :categorySlug="categoryId" />
                    </div>

                    

                    <h2 class="text-2xl font-bold mb-6">Todos Los Artículos ({{ totalPosts }})</h2>
                   
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

                
                <section class="mb-12">
                    <h4 class="text-2xl font-semibold capitalize">Más Categorías</h4>
                    <CategoryCarousel :categories="categories" />
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

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const route = useRoute();
const categoryId = ref(route.params.categoryId);
const categories = ref([]);
const allArticles = ref([]);
const tags = ref({});
const category = ref({});
const loaded = ref(false);
const featuredPosts = ref([]);

const currentPage = ref(1);
const ITEMS_PER_PAGE = 1;
const MAX_VISIBLE_PAGES = 5;
const totalPosts = ref(0)


const fetchCategory = async (id) => {

    console.log('slug', id)

    const response = await fetch(

        `https://latin.dedyn.io/items/posts_categories?fields=*.*&filter={"id":{"_eq" : "${id}"  }}` //working
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
    category.value = result.data[0]
    console.log('resulted category', result.data)

}

const countCategoryPosts = async (slug) => {
    try {
        const response = await fetch(
            `https://latin.dedyn.io/items/posts?aggregate[count]=id&filter={ "category": { "id":{"_eq" : "${slug}" }  }}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) throw new Error('Failed to count posts');

        const result = await response.json();
        totalPosts.value = result.data[0].count.id;
        console.log('total post count value', totalPosts.value)

    } catch (error) {
        console.error('Error counting posts count');
    }
};



const fetchPostsByCategory = async (slug, page = 1) => {

    const offset = (page - 1) * ITEMS_PER_PAGE;

    const response = await fetch(

        `https://latin.dedyn.io/items/posts?fields=*.*&filter={ "category": { "id":{"_eq" : "${slug}" } }}&limit=${ITEMS_PER_PAGE}&offset=${offset}` //working

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
    console.log('resulted category posts', result.data)

    return result

}


const fetchTagCountsByCategory = async (categoryId) => {
    try {
        // Make the request
        const response = await fetch(
            `https://latin.dedyn.io/items/posts_post_tags?aggregate[count]=id&groupBy[]=post_tags_id&filter[posts_id][category][_eq]=${categoryId}`
        );

        if (!response.ok) throw new Error('Failed to fetch tag counts');

        const result = await response.json();

        console.log('tags', result.data)

        tags.value = result.data.map(tag => {
            return {
                id: tag.post_tags_id,
                count: tag.count.id
            }
        })

        

    } catch (error) {
        console.error('Error fetching tag counts:', error);
        return [];
    }
};


const handleTagSelect = (tag) => {
    console.log('clicked')
    console.log('clicked on', slugify(tag))
    //selectedTag.value = tag;

    currentPage.value = 1; // Reset to the first page when a new tag is selected
};


const fetchFeaturedPostsByCategory = async (categoryId) => {

    //  const query=`{ "category": { "name":{"_eq" : "${category}" }  } ,"_and" : [{"featured" : {"_eq" : true} }] }` //working

    const query = `{ "category": 
          { "id":
              {"_eq" : "${categoryId}" }  
           } ,"_and" :
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
    featuredPosts.value = result.data

    console.log('featured by category', featuredPosts.value)

}

const fetchCategories = async () => {

    try {
        const response = await fetch(

            'https://latin.dedyn.io/items/posts_categories?fields=*.*,category_image.*'
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
        fetchPostsByCategory(categoryId.value, page);
        window.scrollTo({ top: 1000, behavior: 'smooth' });
    }
};



onMounted(async () => {

    await fetchCategory(categoryId.value)
    await fetchPostsByCategory(categoryId.value)
    await fetchFeaturedPostsByCategory(categoryId.value)
    await fetchTagCountsByCategory(categoryId.value)
    await countCategoryPosts(categoryId.value)
    await fetchCategories()

    /*
    
    
    
    
    
    */

    loaded.value = true;
    window.scrollTo(0, 0);
});

</script>

<style scoped>
.hero-section {
    position: relative;
    height: 70vh;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
}

.banner-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}

.banner-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hero-content {
    z-index: 1;
    background: rgba(0, 0, 0, 0.5);
    /* Semi-transparent overlay */
    /*padding: 20px;*/
    border-radius: 10px;
}

.stats {
    margin-top: 20px;
}

.stat-item {
    background: rgba(255, 255, 255, 0.1);
    padding: 15px 25px;
    border-radius: 15px;
    transition: transform 0.3s ease, background 0.3s ease;
}

.stat-item:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.2);
}
</style>