<template>
    <div class="px-4 sm:px-2 lg:px-8">

        <div v-if="loaded">

            <div class="mb-12">
                <BannerImageComponent :imageUrl="article.image" :title="article.title"
                    :subtitle="article.description && article.description.length > 180 ? `${article.description.slice(0, 180)}...` : article.description" />
            </div>

            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">

                <div class="flex-1 w-7xl">

                    <Card class="p-6 mb-8 bg-secondary" style="width: 90vw;">
                        <div id="details-container" class="flex" style="flex-direction: row; position: relative;">
                            <div id="details-1" style="width: 60%; padding-right: 50px;">
                                <h2 class="text-2xl font-semibold mb-3">Descripción</h2>
                                <p class="text-muted-foreground">{{ article.description }}</p>
                            </div>
                            <div id="details-2" style="width: 40%;">
                                <h2 class="text-2xl font-semibold mb-3">Detalles</h2>
                                <ul class="space-y-1">
                                    <li class="flex">
                                        <span class="detail font-medium w-24">Fecha:</span>
                                        <span>{{ formatDate(article.date) }}</span>
                                    </li>
                                    <li class="flex">
                                        <span class="detail font-medium w-24">Categoría:</span>
                                        <NuxtLink :to="`/revista/category/${article.category}`"
                                            class="text-primary hover:underline">
                                            {{ article.category }}
                                        </NuxtLink>
                                    </li>
                                    <li class="flex items-start">
                                        <span class="detail font-medium w-24">Etiquetas:</span>
                                        <ArticleTagsBlackComponent :tags="article.tags || []" />
                                    </li>
                                </ul>

                                <SocialMediaLinks v-if="socialLinks" :socialLinks="socialLinks" class="mt-4" />
                            </div>
                        </div>
                    </Card>
                </div>

                <div style="display: flex; flex-direction: row; width: 90vw; position: relative; gap:100px">

                    <div class="toc-container">
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
    </div>
</template>

<script setup>

import { Card } from '@/components/ui/card'
import { ref, onMounted } from 'vue';
let article = ref({})
const slug = useRoute().params.slug[0].toString()
const loaded = ref(false)


useHead({
    link: [
        {
            rel: 'stylesheet',
            href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css',
            integrity: 'sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==',
            crossorigin: 'anonymous',
            referrerPolicy: 'no-referrer'
        }
    ]
})

const fetchContent = async () => {

    const { data } = await useAsyncData('content2', () =>
        queryCollection('blog')
            .where('published', '=', true)
            /*.order('date', 'DESC')*/
            .all()
    );

    console.log('datacontent')
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


const socialLinks = computed(() => ({
    ig: article.value.meta?.ig,
    fb: article.value.meta?.fb,
    onlyfans: article.value.meta?.onlyfans,
    chaturbate: article.value.meta?.chaturbate,
    x: article.value.meta?.x,
    phub: article.value.meta?.phub,
}))


onMounted(async () => {
    await fetchContent()
    await fetchArticle(slug)


    useSeoMeta({
        title: ` Latin Fans | ${slug}`,
        description: article.value.description,
        ogTitle: `${article.value.title} | Latin Fans`,
        ogDescription: article.value.description,
        ogImage: article.value.image,
        twitterCard: 'summary_large_image'
    })

    loaded.value = true
})


</script>


<style>
/* Keep your existing styles */
.detail {
    margin-right: 2px;
}

#article-card {
    width: 60vw;
}

#article-text {
    width: 60vw;
    line-height: 1.7;
}

#article-text p {
    /*margin: 15px;*/
    margin-top: 10px;
    margin-bottom: 10px;
}

#article-text a {
    margin-top: 10vh !important;
    margin-bottom: 10vh !important;
}

#article-text h2 {
    color: rgb(81, 81, 81);
    font-weight: bold;
}

/* TOC styling */
.toc-container {
    width: 30vw;
    position: sticky;
    top: 80px;
    align-self: flex-start;
    max-height: 70vh;
    overflow: auto;
}

/* Responsive styles */
@media (max-width: 768px) {

    #main-container{
       /* padding-top: 0;*/
    }

    #details-container{
        flex-direction: column;
    }

    #details-1, #details-2{
        width: 100% !important;
        padding-right:0;
    }

    .toc-container {
        position: static;
        width: 100%;
        max-height: none;
        order: 1;
        margin-top: 20px;
    }

    #article-card,
    #article-text {
        width: 100%;
    }

    div[style*="flex-direction: row"] {
        flex-direction: column !important;
        gap: 20px !important;
    }

    div[style*="width: 60vw"] {
        width: 100% !important;
    }
}
</style>