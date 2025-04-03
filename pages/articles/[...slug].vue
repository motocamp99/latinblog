<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Banner Image with proper spacing -->
        <div class="mb-12">
            <BannerImageComponent :imageUrl="data.image" :title="data.title" :subtitle="data.meta?.subtitle" />
        </div>

        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <!-- Main Content (Right Column) -->
            <div class="flex-1 w-7xl">
                <!-- Article Metadata -->
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
                <!-- Sticky Table of Contents -->
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

                <!-- Article Content -->
                <div style="width: 60vw;">
                    <div class="p-4" id="article-card">
                        <ContentRenderer :value="data" id="article-text" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Card } from '@/components/ui/card'

const slug = useRoute().params.slug[0].toString()
const { data } = await useAsyncData(() => queryCollection('blog').path('/articles/' + slug).first())

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

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

#article-text p{
    margin: 15px;
}

#article-text a {
    margin-top: 10vh !important;
    margin-bottom: 10vh !important;
}

#article-text h2{
    color:rgb(81, 81, 81);
    font-weight:bold;
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