<template>
    <div v-if="loaded">

        <!--{{ allArticles }}-->

        <section class="mb-12 px-4 lg:px-24" v-if="bannerImages">
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
        <span class="sr-only">Cargando...</span>

    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';

const allArticles = ref([]);
const loaded = ref(false);
const bannerImages = ref([])
const categoryArticles = ref([]);
const tags = ref({});
const categories = ref([]);
const currentPage = ref(1);
const itemsPerPage = 12;

const fetchBannerImages = async () => {
    const { data } = await useFetch('/assets/images/banner/hero-banners.json');
    bannerImages.value = data.value;
    console.log('banners', bannerImages.value)
};
/*

const fetchArticle = async (slug) => {
    const { data } = await useAsyncData('article', () =>
        queryCollection('blog')
            .path('/articles/' + slug)
            .first()
    );

    console.log('firstarticle', data)
    console.log('firstarticle2', data.value)
}

*/

const fetchContent = async () => {

    const { data } = await useAsyncData('content', () =>
        queryCollection('blog')
            .where('published', '=', true)
            /*.order('date', 'DESC')*/
            .all()
    );

    console.log('datacontent', data)
}

const fetchPublishedArticles = async () => {

    const { data } = await useAsyncData('content', () =>
        queryCollection('blog')
            .where('published', '=', true)
            /*.order('date', 'DESC')*/
            .all()
    );

    allArticles.value = data.value
    const tagCounts = {};
    const categoryMap = new Map();
    const featuredByCategory = new Map();
    console.log('articlesss', allArticles.value)

    allArticles.value.forEach((article) => {
        if (article['tags']) {
            article['tags'].forEach((tag) => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        }
        if (article['category']) {
            const categoryName = article['category'];
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
            if (article.featured) {
                if (!featuredByCategory.has(categoryName)) {
                    featuredByCategory.set(categoryName, []);
                }
                featuredByCategory.get(categoryName).push(article);
            }
        }
    });

    tags.value = tagCounts;
    categories.value = Array.from(categoryMap.values());
    // Prepare categoryArticles array with featured articles
    categoryArticles.value = Array.from(featuredByCategory.entries()).map(([category, articles]) => ({
        category,
        articles: articles.slice(0, 5) // Limit to 5 featured articles per category
    }));
}

const paginatedArticles = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return allArticles.value.slice(start, end);
});

// Total number of pages for filtered articles
const totalPages = computed(() => Math.ceil(allArticles.value.length / itemsPerPage));

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



onMounted(async () => {

    await fetchContent()
    await fetchBannerImages()
    await fetchPublishedArticles()

    loaded.value = true

})



</script>

<style scoped></style>