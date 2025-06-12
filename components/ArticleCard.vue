<template>
    <!---->

    <Card class="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">

        <NuxtLink :to="`/posts/${article.slug ? article.slug : slugify(article.title)}`">
            <div id="img_container" class="overflow-hidden" :style="`height: ${img_height}`">
                <NuxtImg :src="article.image?.id ? `${article.image.id}` : '2df8b198-befd-4aa5-87cb-49f7da84b604'"
                    quality=70 :width=img_width provider="directus" loading="lazy" />
            </div>
        </NuxtLink>


        <CardHeader class="flex-grow p-3 md:p-6">
            <div class="flex items-center gap-2 mb-2" v-if="!minimal">
                <NuxtLink v-if="article.category" :to="`/posts/category/${slugify(article.category.id)}`">
                    <span class="text-xs font-medium px-1 md:px-3 py-1 bg-primary text-primary-foreground rounded-full">
                        {{ deslugify(article.category.id) }}
                    </span>
                </NuxtLink>
            </div>
            <span class="text-xs text-muted-foreground">
                {{ formatDate(article.date_created) }}
            </span>
            <CardTitle class="text-sm md:text-base lg:text-base xl:text-base ">{{ article.title }}</CardTitle>
            <CardDescription v-if="!minimal" class="line-clamp-3">{{ article.description }}</CardDescription>
        </CardHeader>



        <CardContent class="pt-0 pb-0 px-1 md:px-6 " v-if="!minimal">
            <TagsComponent :tags="article.tags || []" :isPost="true" />
        </CardContent>


        <CardFooter class="pt-1 p-3 md:p-6"> <!--style="padding: 0 !important;"-->

            <NuxtLink :to="`/posts/${article.slug ? article.slug : slugify(article.title)}`"
                class="text-sm font-medium text-primary hover:underline">
                Leer más →
            </NuxtLink>

        </CardFooter>

    </Card>
</template>

<script setup lang="ts">
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

const props = defineProps({
    article: {
        type: Object,
        required: true,
        default: () => ({
            title: 'No title',
            description: 'No description',
            image: '',
            date: '',
            category: '',
            tags: []
        })
    }, img_height: {
        type: String,
        default: "40vh"
    }, img_width: {
        type: String,
        default: '33vw'
    }, minimal: {
        type: Boolean,
        default: false
    }
})

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('es-ES', options)
}


</script>



<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.aspect-w-16 {
    position: relative;
    padding-bottom: 56.25%;
    /* 16:9 aspect ratio */
}

.aspect-w-16 img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

@media (max-width: 640px) { /* You can adjust this breakpoint as needed */
    #img_container {
        height: 20vh !important;
    }
}


</style>