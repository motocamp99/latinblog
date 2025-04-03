<template>
    <div>
        testinfg
    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';


const featuredArticles = ref([]);

//new
/*
const { data } = await useAsyncData('blog', () => {
    return queryCollection('blog').all()
})
*/

//console.log('data1', data)


const fetchContent = async () => {

    const { data } = await useAsyncData('content', () => {
        return queryCollection('content').all()
    });

    console.log('data', data)
};

const fetchFeaturedArticles = async () => {
    const { data } = await useAsyncData('featured', () =>
        queryCollection('blog')
            .where('featured', '=', true)
            .order('date', 'DESC')
            .limit(12)
            .all()
    );
    featuredArticles.value = data.value;
};


onMounted(async () => {

    await fetchContent()
    await fetchFeaturedArticles()
    /*
    const { data } = await useAsyncData('blog', () => {
        return queryCollection('blog').all()
    })
    */

    /*
    const query = queryCollection('blog')
        .where('published', '=', true)
        .order('date', 'DESC');

    const { data } = await useAsyncData('blog', () => query.all());

    console.log('data10', data)*/

    const { data } = await useAsyncData('blog', () => queryCollection('blog').all())
    console.log('data', data)


})



</script>

<style scoped></style>