<template>
    <div>
        <!-- Hero Section -->

        <div v-if="loaded">

            {{ tag }}
            
            <section class="mb-6">
                <TagBanner :tag="tag" />
            </section>
            
            <section class="px-4 lg:px-24">

                <h2 class="text-2xl font-bold mb-6">Featured Models With Tag ({{ tagName }})</h2>
                <section class="mb-6">
                    <FeaturedCarousel :items="featuredModels" :isModel="true" />
                </section>


               
                <div v-if="allModels.length > 0">

                    <h2 class="text-2xl font-bold mb-6">All Models ({{ totalModels }}) </h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <ModelCard v-for="model in allModels" :key="model.title" :model="model"
                            class="w-full h-full" />
                    </div>
              
                    
                    <nav aria-label="Page navigation" class="mt-8 mb-12">
                        <ul class="flex justify-center lg:justify-start flex-wrap gap-1">
                            <li>
                                <Button variant="outline" @click="changePage(1)" :disabled="currentPage === 1">
                                    First
                                </Button>
                            </li>
                            <li>
                                <Button variant="outline" @click="changePage(currentPage - 1)"
                                    :disabled="currentPage === 1"> <
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
                                 >
                                </Button>
                            </li>
                            <li>
                                <Button variant="outline" @click="changePage(totalPages)"
                                    :disabled="currentPage === totalPages">
                                    Last
                                </Button>
                            </li>
                        </ul>
                    </nav>
         
                </div>

                <div v-else class="text-center py-12">
                    <p class="text-gray-500">No articles found</p>
                </div>

                <!--
                <div class="mb-8">
                    <h2 class="text-2xl font-bold mb-4">More Tags</h2>
                    <Tags :tags="tags" @tag-selected="handleTagSelect" />
                </div>
               -->

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
            <span class="sr-only">Loading...</span>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const tagSlug=route.params.tagSlug[0]
const tagName = ref(deslugify(route.params.tagSlug[0]));
const allModels = ref([]); // Store all fetched articles
const tag = ref({});
const loaded = ref(false);
const featuredModels = ref([]);
const tags = ref([]);

const totalModels = ref(0)
const currentPage = ref(1);
const ITEMS_PER_PAGE = 2;
const MAX_VISIBLE_PAGES = 5;

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
        tag.value = result.data[0]

    } catch (error) {
        console.log('error with tag')
    }

}

const fetchTags = async () => {

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
        tags.value = result.data

        console.log('all tags', tags.value)

    } catch (error) {
        console.error('error with tags')
    }

}


const countModels = async (tagSlug) => {

    try {
        const response = await fetch(
            `https://latin.dedyn.io/items/models?aggregate[countDistinct]=id&filter={"tags": { "_some": {"model_tags_id" : {"_eq" : "${tagSlug}" }} }}`
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
        console.log('rrr', result.data)
        totalModels.value = result.data[0].countDistinct.id;

    } catch (error) {
        console.error('error with posts count')
    }

}


const fetchFeaturedModelsByTagSlug = async (tagSlug) => {

    //  const query=`{ "category": { "name":{"_eq" : "${category}" }  } ,"_and" : [{"featured" : {"_eq" : true} }] }` //working

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

}

const fetchModelsByTagSlug = async (tagSlug, page = 1) => {

    try {
        const offset = (page - 1) * ITEMS_PER_PAGE;

        const response = await fetch(
            `https://latin.dedyn.io/items/models?fields=*.*&filter={"tags": { "_some": {"model_tags_id" : {"_eq" : "${tagSlug}" }} }}&limit=${ITEMS_PER_PAGE}&offset=${offset} `  //working //fileds=*.* includes all nested fields from relationships
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

    } catch (error) {
        console.log('error fetching models')
    }

}

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
        fetchModelsByTagSlug(tagSlug, page);
        window.scrollTo({ top: 1000, behavior: 'smooth' });
    }
};


onMounted(async () => {

    await fetchTag(tagSlug)
    await fetchFeaturedModelsByTagSlug(tagSlug)
    await countModels(tagSlug)
    await fetchModelsByTagSlug(tagSlug)
    /*
    await fetchTags()
    */
    //await fetchFeaturedArticles();
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