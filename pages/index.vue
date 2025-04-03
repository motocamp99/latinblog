<template>
    <div v-if="loaded">
        
        <!--{{ allArticles }}-->

        <section class="mb-12 px-4 lg:px-24" v-if="bannerImages">
            <SimpleHero :images="bannerImages" />
        </section>
    </div>
    <div v-else>
        ...Loading
    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';

const allArticles = ref([]);
const loaded = ref(false);
const bannerImages = ref([])

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

    console.log('publishedArticles', data)
    console.log('publishedArticles value', data.value)
}



onMounted(async () => {

    await fetchContent()
    await fetchBannerImages()
    await fetchPublishedArticles()
    loaded.value = true

})



</script>

<style scoped></style>