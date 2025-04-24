<template>
    <div v-if="loaded">

        <section class="mb-12 px-4 lg:px-24 mt-12" v-if="bannerImages">
            <SimpleHero :images="bannerImages" />
        </section>

        <section class="mb-12 px-4 lg:px-24 mt-12">
            <h2 class="text-2xl font-bold mb-6">Artículos Sugeridos</h2>

            <FeaturedPostsCarousel :posts="featuredPosts" />
        </section>

        <section class="mb-12 px-4 lg:px-24">
            <h4 class="text-2xl font-semibold capitalize">Categorías</h4>
            <CategoryCarousel :categories="categories" />
        </section>


        <section class="mb-12 lg:px-14">
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
</template>

<script setup>

import { ref, onMounted } from 'vue';

const allArticles = ref([]);
const loaded = ref(false);
const bannerImages = ref([])
const categoryArticles = ref([]);
const tags = ref([]);
const categories = ref([]);
const currentPage = ref(1);
const featuredPosts = ref([]);
const ITEMS_PER_PAGE = 4;
const MAX_VISIBLE_PAGES = 5;

const totalPosts = ref(0);

const fetchBanners = async () => {

try {
    const response = await fetch(

        'https://latin.dedyn.io/files?filter[folder][_eq]=bd45adf5-6a58-4260-ba9d-714be838af8e', //working
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                /*'Authorization': `Bearer ${token}`*/
            },
        }
    );
    if (!response.ok) throw new Error('Failed to fetch info data');
    const result = await response.json();
    let processed=result.data.map(elem=>{
        return {
            src:`${elem.id}`,
            alt:null,
            title:null
        }
    })
    
    //bannerImages.value=result.data
    console.log('resulted banners', processed)
    bannerImages.value=processed

} catch (error) {
    console.error('Error fetching categories:');
}

}


const fetchCategories = async () => {

    try {
        const response = await fetch(

            'https://latin.dedyn.io/items/categories?fields=*.*,category_image.*' 
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

const fetchPosts = async (page = 1) => {
    const offset = (page - 1) * ITEMS_PER_PAGE;

    try {
        const response = await fetch(
            `https://latin.dedyn.io/items/posts?filter[status][_eq]=published&fields=*.*,image&limit=${ITEMS_PER_PAGE}&offset=${offset}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) throw new Error('Failed to fetch posts');

        const result = await response.json();
        allArticles.value = result.data;
        currentPage.value = page;

        console.log('total posts value', allArticles.value)

    } catch (error) {
        console.error('Error fetching posts:');
    }
};

const fetchTags = async () => {

    try {
        const response = await fetch(

            'https://latin.dedyn.io/items/tags?fields=*.*' 
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

const countPosts = async () => {
    try {
        const response = await fetch(
            'https://latin.dedyn.io/items/posts?aggregate[count]=*',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) throw new Error('Failed to count posts');

        const result = await response.json();
        totalPosts.value = result.data[0].count;
        console.log('total posts value', totalPosts.value)

    } catch (error) {
        console.error('Error counting posts count');
    }
};


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
        featuredPosts.value=result.data

        console.log('featured posts', result.data)
        return result.data

    } catch (error) {
        console.error('error with featured POSTS')
        return null

    }

    return null

}


const organizePostsByCategory = (posts) => {
    if (!posts || posts.length === 0) return [];

    const categoriesMap = new Map();

    posts.forEach(post => {
        // Handle cases where category might be missing
        const category = post.category || { name: 'Featured' };

        // Use category name as the unique identifier
        const categoryName = category.name || 'Featured';

        // Check if we already have this category in our map
        if (!categoriesMap.has(categoryName)) {
            // Store both the category object and articles array
            categoriesMap.set(categoryName, {
                category: category,  // Store the full category object
                articles: []        // Initialize empty articles array
            });
        }

        // Add the post to the articles array for this category
        categoriesMap.get(categoryName).articles.push(post);
    });

    // Convert to array format that your component expects
    return Array.from(categoriesMap.values()).map(item => ({
        category: item.category.name,  // Just use the name for the category identifier
        articles: item.articles        // The array of articles
    }));
};

const populateCategoryCarrousels = async () => {
    const featuredPosts = await fetchFeaturedPosts();
    if (featuredPosts) {
        // First organize by category
        const organizedPosts = organizePostsByCategory(featuredPosts);

        // Filter out duplicates (in case organizePostsByCategory didn't catch them)
        const uniqueCategories = new Set();
        categoryArticles.value = organizedPosts.filter(item => {
            if (!uniqueCategories.has(item.category)) {
                uniqueCategories.add(item.category);
                return true;
            }
            return false;
        });

        console.log('Unique category arrays', categoryArticles.value);
    }
};

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
        fetchPosts(page);
        window.scrollTo({ top: 3000 , behavior:'smooth'});
    }
};


onMounted(async () => {
    
    await Promise.all([
        //fetchInit(),
        countPosts(),
        //fetchBannerImages(),
        fetchCategories(),
        populateCategoryCarrousels(),
        fetchFeaturedPosts(),
        countPosts(),
        fetchPosts(),
        fetchTags(),
        fetchBanners()
    ]);

    console.log('Category Articles', categoryArticles.value)

    loaded.value = true;

})



</script>

<style scoped></style>