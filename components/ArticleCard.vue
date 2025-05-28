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
    },img_height: {
        type: String,
        default:"40vh"
    },img_width:{
        type: Number,
        default:500
    }, minimal:{
        type:Boolean,
        default : false
    }
})

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('es-ES', options)
}


</script>

<template>
    <!---->

    <Card class="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">

        <NuxtLink :to="`/posts/${article.id}/${article.slug? article.slug : slugify(article.title)}`">
            <div class="overflow-hidden" :style="`height: ${img_height}`"> 
                <NuxtImg
                    :src="article.image?.id ? `${article.image.id}` : '2df8b198-befd-4aa5-87cb-49f7da84b604'"
                    quality=70 :width=img_width provider="directus"  loading="lazy"/>
            </div>
        </NuxtLink>


        <CardHeader class="flex-grow">
            <div class="flex items-center gap-2 mb-2" v-if="!minimal">
                <NuxtLink v-if="article.category" :to="`/category/${slugify(article.category.id)}`">
                    <span class="text-xs font-medium px-2 py-1 bg-primary text-primary-foreground rounded-full">
                        {{ deslugify(article.category.id) }}
                    </span>
                </NuxtLink>
                <span class="text-xs text-muted-foreground">
                    {{ formatDate(article.date_created) }}
                </span>
            </div>
            <CardTitle class="text-lg line-clamp-2">{{ article.title }}</CardTitle>
            <CardDescription v-if="!minimal" class="line-clamp-3">{{ article.description }}</CardDescription>
        </CardHeader>

        

        <CardContent class="pt-0" v-if="!minimal">
            <ArticleTagsComponent :tags="article.tags || []" />
        </CardContent>
       

        <CardFooter class="pt-0">
            
            <NuxtLink :to="`/articles/${article.id}/${article.slug? article.slug : slugify(article.title)}`"
                class="text-sm font-medium text-primary hover:underline">
                Leer más →
            </NuxtLink>

        </CardFooter>

    </Card>
</template>


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
</style>