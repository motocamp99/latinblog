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

    const { data } = await useAsyncData('featured', () => {
        return queryCollection('content').all()
    });


    console.log(data)
};

onMounted(async () => {
    
    await fetchContent()
    const { data } = await useAsyncData('blog', () => {
        return queryCollection('blog').all()
    })
    console.log('data1', data)

})



</script>

<style scoped></style>