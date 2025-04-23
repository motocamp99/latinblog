<template>
    <div>
        <!-- Hero Section -->
        <div v-if="loaded">
            <!--
            <section>
                <NuxtImg :src="`assets/images/categories/${categoryName}.png`" class="w-full" />
            </section>

            <section class="px-4 lg:px-24">
                <div v-if="allArticles.length > 0">

                    <div class="mb-8">
                        <h2 class="text-2xl font-bold mb-4">Etiquetas</h2>
                        <Tags :tags="tags" @tag-selected="handleTagSelect" />
                    </div>


                    <h2 class="text-2xl font-bold mb-6">Todos Los Artículos</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <ArticleCard v-for="article in paginatedArticles" :key="article.title" :article="article"
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
                                <Button variant="outline" @click="changePage(page)"
                                    :class="{ 'bg-primary text-primary-foreground': page === currentPage }">
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
            -->

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
import { useRoute } from 'vue-router';

const route = useRoute();
const categoryName = ref(route.params.categoryName[0]);
const allArticles = ref([]); // Store all fetched articles
const tags = ref({});
const currentPage = ref(1);
const itemsPerPage = 4; // Number of articles per page
const banners = ref([]);
const loaded = ref(false);
const featuredArticles = ref([]);
const selectedTag = ref('todos'); // Default to 'todos' to show all articles


const fetchContent = async () => {

    const { data } = await useAsyncData('content23', () =>
        queryCollection('blog')
            .where('published', '=', true)
            /*.order('date', 'DESC')*/
            .all()
    );

    console.log('datacontent')
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
    allArticles.value = result.data

    console.log('featured by category', result)

}

const fetchPostsByTagName = async (tagName) => {

    const response = await fetch(
        `https://latin.dedyn.io/items/posts?fields=*.*&filter={"tags": { "_some": {"tags_id" : {"_eq" : "${tagName}" } }  }} `  //working //fileds=*.* includes all nested fields from relationships
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

    console.log('resulted directus filtered by tagname', result)

}


// Fetch all articles for the category
const fetchAllArticles = async () => {
    const query = queryCollection('blog')
        .where('published', '=', true)
        .where('category', '=', categoryName.value)
        .order('date', 'DESC');

    const { data } = await useAsyncData('blog', () => query.all());
    console.log('cat articles', data)
    allArticles.value = data.value;

    // Extract and count tags
    const tagCounts = {};
    allArticles.value.forEach((article) => {
        if (article.tags) {
            article.tags.forEach((tag) => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        }
    });
    tags.value = tagCounts;
};

// Fetch featured articles
const fetchFeaturedArticles = async () => {
    const { data } = await useAsyncData('featured', () =>
        queryCollection('blog')
            .where('category', '=', categoryName.value)
            .where('featured', '=', true)
            .order('date', 'DESC')
            .limit(6)
            .all()
    );
    featuredArticles.value = data.value;
};

// Handle tag selection
const handleTagSelect = (tag) => {
    selectedTag.value = tag;
    currentPage.value = 1; // Reset to the first page when a new tag is selected
};

// Filter articles based on the selected tag
const filteredArticles = computed(() => {
    if (selectedTag.value === 'todos') {
        return allArticles.value; // Show all articles
    }
    return allArticles.value.filter((article) => article.tags && article.tags.includes(selectedTag.value));
});

// Paginate filtered articles
const paginatedArticles = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredArticles.value.slice(start, end);
});

// Total number of pages for filtered articles
const totalPages = computed(() => Math.ceil(filteredArticles.value.length / itemsPerPage));

// Visible pages for pagination
const visiblePages = computed(() => {
    const pages = [];
    const totalVisibleButtons = 5;
    let startPage = currentPage.value - Math.floor(totalVisibleButtons / 2);
    let endPage = currentPage.value + Math.floor(totalVisibleButtons / 2);

    if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(totalVisibleButtons, totalPages.value);
    }
    if (endPage > totalPages.value) {
        endPage = totalPages.value;
        startPage = Math.max(1, endPage - totalVisibleButtons + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
        pages.push(page);
    }

    return pages;
});

// Change page
const changePage = (page) => {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
        //window.scrollTo(0, 0);
    }
};

onMounted(async () => {

    await fetchContent(); // Fetch banner data
    await fetchAllArticles(); // Fetch all articles for the category
    await fetchFeaturedArticles();
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