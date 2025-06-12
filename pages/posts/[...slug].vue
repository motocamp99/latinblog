<template>
    <div class="px-4 sm:px-2 lg:px-8">

        <div v-if="loaded">

            <div class="mb-12">

                <BannerImageComponent
                    :imageUrl="article.image?.id ? `${article.image.id}` : '310dc800-3921-43ce-86a2-a8f2b2d42f2f'"
                    :title="article.title"
                    :subtitle="article.description && article.description.length > 180 ? `${article.description.slice(0, 180)}...` : article.description" />
            </div>

            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;"
                v-if="article">

                <div class="flex-1 w-7xl">

                    <Card class="p-6 mb-8 bg-secondary" style="width: 90vw;">
                        <div id="details-container" class="flex" style="flex-direction: row; position: relative;">
                            <div id="details-1" style="width: 60%; padding-right: 50px;">
                                <h2 class="text-2xl font-semibold mb-3">Descripción</h2>
                                <p class="text-muted-foreground">{{ article.description }}</p>
                            </div>
                            <div id="details-2" style="width: 40%;">
                                <h2 class="text-2xl font-semibold mb-3">Detalles</h2>
                                <ul class="space-y-2">
                                    <li class="flex gap-2">
                                        <span class="detail font-medium w-24">Fecha:</span>
                                        <span>{{ formatDate(article.date_created) }}</span>
                                    </li>
                                    <li class="flex gap-2">
                                        <span class="detail font-medium w-24">Categoría:</span>

                                        <span
                                            class="text-xs font-medium px-2 py-1 bg-primary text-primary-foreground rounded-full">
                                            <NuxtLink :to="`/posts/category/${article.category.id}`" class="text-current text-xs md:text-xs" >
                                                {{ deslugify(article.category.id) }}
                                            </NuxtLink>
                                            
                                        </span>

                                    </li>
                                    <li class="flex items-start gap-2">
                                        <span class="detail font-medium w-24">Etiquetas:</span>
                                        <ArticleTagsBlackComponent :tags="article.tags || []" />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Card>
                </div>

                <div style="display: flex; flex-direction: row; width: 90vw; position: relative; gap:100px">

                    <div class="toc-container">


                        <Card class="p-4 bg-secondary">
                            <h2 class="text-2xl font-semibold mb-4">Tabla de Contenido</h2>
                            <TableOfContents :html-content="processHtml(article.content)" />
                        </Card>
                    </div>


                    <div style="width: 60vw;">
                        <article v-html="processHtml(article.content)" class="p-4" id="article-card">
                        </article>

                        <div v-if="articleImages">
                            <ArticleImageGallery :images="articleImages" />
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
//const slug = useRoute().params.slug[0].toString()
const loaded = ref(false)
const route = useRoute()
//const { id, slug } = route.params
//const id = route.params.id
const slug = route.params.slug ? route.params.slug[0] : ''

const processedHtml = ref('')
const tocItems = ref([])
const articleImages = ref([])

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


const processHtml = (html) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const headings = doc.querySelectorAll('h2')
    console.log('headings')

    tocItems.value = Array.from(headings).map((heading, index) => {
        const id = heading.textContent
            ? slugify(heading.textContent)
            : `section-${index}` // Fallback if empty heading
        heading.id = id
        return { id, text: heading.textContent || '' }
    })

    return doc.body.innerHTML
}


const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}


const fetchArticleBySlug = async (slug) => {

    try {
        console.log('slug is ', slug)
        const query = `
                  { "slug" : 
                          {"_eq" : "${slug}"} 
                  }
              `
        const response = await fetch(

            `https://latin.dedyn.io/items/posts?fields=*.*&filter=${query}&limit=1&offset=0`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        if (!response.ok) throw new Error('Failed to fetch info data');
        const result = await response.json();
        article.value = result.data[0]
        console.log('resulted article', article.value)

        if (article.value.gallery_images) {

            articleImages.value = article.value.gallery_images.map(elem => elem.directus_files_id)
            console.log('cat images', articleImages.value)
            console.log('raw', article.value.gallery_images)
        }

        console.log('articleimages', articleImages.value)

    } catch (error) {
        console.log('error', error)
    }

}



const fetchArticle = async (id) => {

    const response = await fetch(

        `https://latin.dedyn.io/items/posts/${id}?fields=*.*`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
    if (!response.ok) throw new Error('Failed to fetch info data');
    const result = await response.json();

    console.log('resulted article', result.data)
    article.value = result.data
}

/*
const socialLinks = computed(() => ({
    ig: article.value.meta?.ig,
    fb: article.value.meta?.fb,
    onlyfans: article.value.meta?.onlyfans,
    chaturbate: article.value.meta?.chaturbate,
    x: article.value.meta?.x,
    phub: article.value.meta?.phub,
}))
*/

onMounted(async () => {

    //await fetchArticle(id)
    await fetchArticleBySlug(slug)
    await fetchArticleBySlug(slug)

    /*

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

    */

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

#article-card {
    width: 60vw;
    line-height: 1.7;
}

#article-card h1 {
    font-size: 3rem;
    color: rgb(81, 81, 81);
    font-weight: bold;
}

#article-card h2 {
    font-size: 2rem;
    color: rgb(81, 81, 81);
    font-weight: bold;
}

#article-card p {
    /*margin: 15px;*/
    font-size: 18px;
    margin-top: 10px !important;
    margin-bottom: 10px !important;
}

#article-card a {
    margin-top: 10vh !important;
    margin-bottom: 10vh !important;
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

    #main-container {
        /* padding-top: 0;*/
    }

    #details-container {
        flex-direction: column;
    }

    #details-1,
    #details-2 {
        width: 100% !important;
        padding-right: 0;
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