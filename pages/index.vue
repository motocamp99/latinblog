<template>
    <div v-if="loaded">

        <!--{{ allArticles }}-->

        <section class="mb-12 px-4 lg:px-24" v-if="bannerImages">
            <SimpleHero :images="bannerImages" />
        </section>

        <section class="mb-12">
            <CategoriesCarousel :categoryArticlesArray="categoryArticles" />
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
    // Extract unique categories
    const categoryMap = new Map();
    // For featured articles by category
    const featuredByCategory = new Map();

    console.log('articlesss', allArticles.value)


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
}



onMounted(async () => {

    await fetchContent()
    await fetchBannerImages()
    await fetchPublishedArticles()

    loaded.value = true

})



</script>

<style scoped></style>