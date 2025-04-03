<template>
    <div class="main-container">
        <div v-if='loaded'>
            loaded
            {{ allArticles }}
            <!--
            <section class="mb-12 px-4 lg:px-24">
                <SimpleHero :images="bannerImages" />
            </section>

          
            <section class="mb-12">
                <CategoriesCarousel :categoryArticlesArray="categoryArticles" />
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
        </div>
        <div v-else class="flex justify-center items-center h-64">
            <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
            </svg>
            <span class="sr-only">Cargando...</span>-->

        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const allArticles = ref([]);
const featuredArticles = ref([]);
const currentPage = ref(1);
const itemsPerPage = 12; // Increased for better pagination
const selectedCategory = ref('');
const categories = ref([]);
const categoryArticles = ref([]);
const loaded = ref(false);
const tags = ref({});
const selectedTag = ref('todos');
const bannerImages = useBannerImages();

const { data: posts } = await useAsyncData('blog', () => queryCollection('blog').all())
console.log('data', posts)

const fetchAllArticles = async () => {

    try {

        const allArts = [];

        // Method 1: Direct assignment (recommended)
        const { data } = await useAsyncData('blog', () => {
            return queryCollection('blog')
                .order('date', 'DESC')
                .all()

        });
        console.log('datum', data)
        console.log('datum obj', Object.keys(data))
        console.log('datum value', data.value)
        console.log('datum value2', data._value)
        

        // This will work because await ensures the promise is resolved
        allArticles.value = data.value || [];
        console.log('Articles assigned:', allArticles.value.length);
        console.log('Articles', allArticles.value);

        loaded.value=true

        // const query = queryCollection('blog').order('date', 'DESC');
        /*.where('published', '=', true)*/


        /*
        const { data } = await useAsyncData('blog', () => query.all());

        console.log('data value', data)

        allArticles.value = data.value;
        */

        /*
        const { data } = await useAsyncData('blog', () => {
            return queryCollection('blog').all()
        })

        Promise.all([data]).then(res=>{
            allArticles.value=data.value
            console.log(allArticles.value)
        })

        
        console.log('all articles', allArticles)
        console.log('all articles', allArticles)


        console.log('data', data)
        console.log('data value', data.value)
        */


        // Extract unique tags
        const tagCounts = {};
        // Extract unique categories
        const categoryMap = new Map();
        // For featured articles by category
        const featuredByCategory = new Map();

        console.log('articlesss', allArticles.value)

        /*
        allArticles.value.forEach((article) => {
            // Process tags
            if (article['tags']) {
                article['tags'].forEach((tag) => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            }

            // Process categories
            if (article['category']) {
                const categoryName = article['category'];

                // For categories list
                if (!categoryMap.has(categoryName)) {
                    categoryMap.set(categoryName, {
                        category: categoryName,
                        category_image: `/assets/images/categories/${categoryName.toLowerCase()}.png`,
                        alt: `${categoryName} category`,
                        count: 1
                    });
                } else {
                    categoryMap.get(categoryName).count++;
                }

                // For featured articles by category
                if (article.featured) {
                    if (!featuredByCategory.has(categoryName)) {
                        featuredByCategory.set(categoryName, []);
                    }
                    featuredByCategory.get(categoryName).push(article);
                }
            }
        });

        // Convert maps to arrays
        tags.value = tagCounts;
        categories.value = Array.from(categoryMap.values());

        // Prepare categoryArticles array with featured articles
        categoryArticles.value = Array.from(featuredByCategory.entries()).map(([category, articles]) => ({
            category,
            articles: articles.slice(0, 5) // Limit to 5 featured articles per category
        }));

        console.log('Categories with featured articles:', categoryArticles.value);
        */

    } catch (error) {

        console.log(error)
        loaded.value = true

    }

};

// Handle tag selection
const handleTagSelect = (tag) => {
    selectedTag.value = tag;
    currentPage.value = 1;
};

// Filter articles based on the selected tag
const filteredArticles = computed(() => {
    if (selectedTag.value === 'todos') {
        return allArticles.value;
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};



/*
const { data } = await useAsyncData('blog', () => {
        return queryCollection('blog').all()
    })

    console.log('last data', data)
    console.log('last data2', data.value)
    allArticles.value=data.value
    console.log('articles value', allArticles.value)

    loaded.value=true*/

/*

onMounted(async () => {
    await fetchAllArticles();
    // await fetchFeaturedArticles();

    
    const { data } = await useAsyncData('blog', () => {
        return queryCollection('blog').all()
    })

    console.log('last data', data)
    console.log('last data2', data.value)
    allArticles.value=data.value
    console.log('articles value', allArticles.value)

    loaded.value = true;
    
});*/

</script>

<style scoped>
.main-container {
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
}
</style>