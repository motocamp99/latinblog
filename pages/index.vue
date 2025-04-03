<template>
    <div>
        {{ data }}
    </div>
</template>

<script setup>

import { ref, computed, onMounted } from 'vue';

/*
const { data } = await useAsyncData('blog', () => queryCollection('blog').all())
console.log(data)
*/

//new

const { data } = await useAsyncData('blog', () => {
    return queryCollection('blog').all()
})


console.log('data1', data)


const fetchContent = async () => {

    const { data } = await useAsyncData('content', () => {
        return queryCollection('content').all()
    });

    console.log(data)
};

onMounted(async () => {
    
    await fetchContent()

    /*
    const { data } = await useAsyncData('blog', () => {
        return queryCollection('blog').all()
    })
    */

    const query = queryCollection('blog')
        .where('published', '=', true)
        .order('date', 'DESC');

    const { data } = await useAsyncData('blog', () => query.all());

    console.log('data10', data)

})



</script>

<style scoped></style>