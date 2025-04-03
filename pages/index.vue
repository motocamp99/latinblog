<template>
    <div>
        testinfg
        {{ featuredArticles }}
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


const fetchContent = async () => {

    const { data } = await useAsyncData('content', () =>
        queryCollection('blog')
            .where('featured', '=', true)
            .order('date', 'DESC')
            .limit(2)
            .all()
    );

    console.log('datacontent', data)
};

const fetchFeaturedArticles = async () => {
    const { data } = await useAsyncData('featured', () =>
        queryCollection('blog')
            .where('featured', '=', true)
            .order('date', 'DESC')
            .limit(12)
            .all()
    );

    console.log('featured', data)
    featuredArticles.value = data.value;
    console.log('featured articles', featuredArticles.value)
    console.log('featured articles2', featuredArticles)
};

/*
const fetchFR = async () => {
    const { data, error: fetchError } = await useFetch('/api/articles');

    if (fetchError.value) {
        throw fetchError.value;
    }

    console.log(data)

    return data

}

*/


onMounted(async () => {

    await fetchContent()
    await fetchFeaturedArticles()
    await fetchArticle('article2')
    // await fetchFR().then(res=>console.log('res', res))


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