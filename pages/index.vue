<template>
    <div>
        testinfg
       <!-- {{ featuredArticles }}-->
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

const fetchArticle= async(slug)=>{
    const { data } = await useAsyncData('article', () =>
        queryCollection('blog')
        .path('/articles/' + slug)
        .first()
    );

    console.log('firstarticle', data)
    console.log('firstarticle2', data.value)
}

/*
const fetchContent = async () => {

    const { data } = await useAsyncData('content', () =>
        queryCollection('blog')
            .where('featured', '=', true)
            .order('date', 'DESC')
            .limit(2)
            .all()
    );

    console.log('datacontent', data)
};*/

const fetchContent = async () => {

const { data } = await useAsyncData('content', () =>
    queryCollection('blog')
        /*.where('featured', '=', true)*/
        .order('date', 'DESC')
        .all()
);

console.log('datacontent', data)
}

const fetchFeaturedArticles = async () => {
    const { data } = await useAsyncData('featured', () =>
        queryCollection('blog')
            .where('featured', '=', true)
            /*.order('date', 'DESC')*/
            /*.limit(12)*/
            .all()
    );

    console.log('featured', data)
    featuredArticles.value = data.value;
    console.log('featured articles', featuredArticles.value)
    console.log('featured articles2', featuredArticles)
};


await fetchContent()

onMounted(async () => {

    //await fetchContent()
    //await fetchFeaturedArticles()
    //await fetchArticle('article2')

    /*
    const { data } = await useAsyncData('blog', () => queryCollection('blog').all())
    console.log('data', data)*/

})



</script>

<style scoped></style>