<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div v-if="loaded">

            <div class="mb-12">
                <BannerImageComponent :imageUrl="article.image" :title="article.title"
                    :subtitle="article.meta.subtitle" />
            </div>

            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">

                <div class="flex-1 w-7xl">

                    <Card class="p-6 mb-8 bg-secondary" style="width: 90vw;">
                        <div class="grid md:grid-cols-2 gap-8">
                            <div>
                                <h2 class="text-2xl font-semibold mb-3">Descripción</h2>
                                <p class="text-muted-foreground">{{ article.description }}</p>
                            </div>
                            <div>
                                <h2 class="text-2xl font-semibold mb-3">Detalles</h2>
                                <ul class="space-y-3 text-muted-foreground">
                                    <li class="flex">
                                        <span class="font-medium w-24">Fecha:</span>
                                        <span>{{ formatDate(article.date) }}</span>
                                    </li>
                                    <li class="flex">
                                        <span class="font-medium w-24">Categoría:</span>
                                        <NuxtLink :to="`/revista/category/${article.category}`"
                                            class="text-primary hover:underline">
                                            {{ article.category }}
                                        </NuxtLink>
                                    </li>
                                    <li class="flex items-start">
                                        <span class="font-medium w-24">Etiquetas:</span>
                                        <ArticleTagsComponent :tags="article.tags || []" />
                                    </li>
                                </ul>

                                <SocialMediaLinks v-if="socialLinks" :socialLinks="socialLinks" class="mt-4" />
                            </div>
                        </div>
                    </Card>
                </div>

                <div style="display: flex; flex-direction: row; width: 90vw; position: relative; gap:100px">

                    <div
                        style="width: 30vw; position: sticky; top: 20px; align-self: flex-start; max-height: 70vh; overflow: auto;">
                        <Card class="p-4 bg-secondary">
                            <h2 class="text-2xl font-semibold mb-4">Tabla de Contenido</h2>
                            <ul style="display: flex; flex-direction: column; gap: 7px;">
                                <li v-for="link in article.body.toc.links" :key="link.id">
                                    <a :href="`#${link.id}`"
                                        class="text-md text-muted-foreground hover:text-primary transition-colors block py-1">
                                        {{ link.text }}
                                    </a>
                                </li>
                            </ul>
                        </Card>
                    </div>


                    <div style="width: 60vw;">
                        <div class="p-4" id="article-card">
                            <ContentRenderer :value="article" id="article-text" />
                        </div>
                    </div>
                </div>
            </div>

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


        <!--
        <div class="mb-12">
            <BannerImageComponent :imageUrl="data.image" :title="data.title" :subtitle="data.meta?.subtitle" />
        </div>

        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
           
            <div class="flex-1 w-7xl">
          
                <Card class="p-6 mb-8 bg-secondary" style="width: 90vw;">
                    <div class="grid md:grid-cols-2 gap-8">
                        <div>
                            <h2 class="text-2xl font-semibold mb-3">Descripción</h2>
                            <p class="text-muted-foreground">{{ data.description }}</p>
                        </div>
                        <div>
                            <h2 class="text-2xl font-semibold mb-3">Detalles</h2>
                            <ul class="space-y-3 text-muted-foreground">
                                <li class="flex">
                                    <span class="font-medium w-24">Fecha:</span>
                                    <span>{{ formatDate(data.date) }}</span>
                                </li>
                                <li class="flex">
                                    <span class="font-medium w-24">Categoría:</span>
                                    <NuxtLink :to="`/revista/category/${data.category}`"
                                        class="text-primary hover:underline">
                                        {{ data.category }}
                                    </NuxtLink>
                                </li>
                                <li class="flex items-start">
                                    <span class="font-medium w-24">Etiquetas:</span>
                                    <ArticleTagsComponent :tags="data.tags || []" />
                                </li>
                            </ul>

                            <SocialMediaLinks v-if="socialLinks" :socialLinks="socialLinks" class="mt-4" />
                        </div>
                    </div>
                </Card>
            </div>

            <div style="display: flex; flex-direction: row; width: 90vw; position: relative; gap:100px">
                
                <div style="width: 30vw; position: sticky; top: 20px; align-self: flex-start; max-height: 70vh; overflow: auto;">
                    <Card class="p-4 bg-secondary">
                        <h2 class="text-2xl font-semibold mb-4">Tabla de Contenido</h2>
                        <ul style="display: flex; flex-direction: column; gap: 7px;">
                            <li v-for="link in data.body.toc.links" :key="link.id">
                                <a :href="`#${link.id}`"
                                    class="text-md text-muted-foreground hover:text-primary transition-colors block py-1">
                                    {{ link.text }}
                                </a>
                            </li>
                        </ul>
                    </Card>
                </div>

          
                <div style="width: 60vw;">
                    <div class="p-4" id="article-card">
                        <ContentRenderer :value="data" id="article-text" />
                    </div>
                </div>
            </div>
        </div>
        -->
    </div>
</template>

<script setup>

import { Card } from '@/components/ui/card'
import { ref, onMounted } from 'vue';
let article = ref({})
const slug = useRoute().params.slug[0].toString()
const loaded = ref(false)
/*
const { data } = await useAsyncData(() => queryCollection('blog').path('/articles/' + slug).first())
*/

const fetchContent = async () => {

    const { data } = await useAsyncData('content2', () =>
        queryCollection('blog')
            .where('published', '=', true)
            /*.order('date', 'DESC')*/
            .all()
    );

    console.log('datacontent', data)
}


const fetchArticle = async (slug) => {
    const { data } = await useAsyncData('article', () =>
        queryCollection('blog')
            .path('/articles/' + slug)
            .first()
    );

    article.value = data.value
    console.log('firstarticle', data)
    console.log('firstarticle2', data.value)
}



const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

/*
const socialLinks = computed(() => ({
    ig: data.value.meta?.ig,
    fb: data.value.meta?.fb,
    onlyfans: data.value.meta?.onlyfans,
    chaturbate: data.value.meta?.chaturbate,
    x: data.value.meta?.x,
    phub: data.value.meta?.phub,
}))

useSeoMeta({
    title: `${data.value.title} | Latin Fans Revista`,
    description: data.value.description,
    ogTitle: `${data.value.title} | Latin Fans Revista`,
    ogDescription: data.value.description,
    ogImage: data.value.image,
    twitterCard: 'summary_large_image'
})
*/

onMounted(async () => {
    await fetchContent()
    await fetchArticle(slug)
    loaded.value = true
})


</script>


<style>
/* Keep your existing styles */
#article-card {
    width: 60vw;
}

#article-text {
    width: 60vw;
    line-height: 1.7;
}

#article-text p {
    margin: 15px;
}

#article-text a {
    margin-top: 10vh !important;
    margin-bottom: 10vh !important;
}

#article-text h2 {
    color: rgb(81, 81, 81);
    font-weight: bold;
}

/* Additional TOC styling */
.toc-container {
    position: sticky;
    top: 20px;
    /*height: fit-content;*/
    max-height: 40vh;
    overflow-y: scroll;
}

.toc-link {
    display: block;
    padding: 4px 0;
    transition: color 0.2s ease;
}

.toc-link:hover {
    color: hsl(var(--primary));
}
</style>