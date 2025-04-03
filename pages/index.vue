<template>
    <div v-if="loaded">
        testinfg
        {{ allArticles }}
    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';

const allArticles = ref([]);
const loaded = ref(false);


//new
/*
const { data } = await useAsyncData('blog', () => {
    return queryCollection('blog').all()
})
*/

//console.log('data1', data)

const fetchArticle = async (slug) => {
    const { data } = await useAsyncData('article', () =>
        queryCollection('blog')
            .path('/articles/' + slug)
            .first()
    );

    console.log('firstarticle', data)
    console.log('firstarticle2', data.value)
}



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

/*
const fetchFeaturedArticles = async () => {
    const { data } = await useAsyncData('featured', () =>
        queryCollection('blog')
            .where('featured', '=', true)
            .all()
    );

    console.log('featured', data)
    featuredArticles.value = data.value;
    console.log('featured articles', featuredArticles.value)
    console.log('featured articles2', featuredArticles)
};

*/


onMounted(async () => {

    await fetchContent()
    //await fetchFeaturedArticles()
    await fetchPublishedArticles()
    loaded.value=true

})



</script>

<style scoped></style>