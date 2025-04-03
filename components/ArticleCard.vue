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
    }
})

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('es-ES', options)
}

</script>

<template>
    <Card class="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
        <NuxtLink :to="`/articles/${article.stem.split('/')[1]}`">
            <div class="overflow-hidden" style="max-height: 40vh;">
                <NuxtImg :src="article.image" quality="40" />
            </div>
        </NuxtLink>

        <CardHeader class="flex-grow">
            <div class="flex items-center gap-2 mb-2">
                <span v-if="article.category"
                    class="text-xs font-medium px-2 py-1 bg-primary text-primary-foreground rounded-full">
                    {{ article.category }}
                </span>
                <span class="text-xs text-muted-foreground">
                    {{ formatDate(article.date) }}
                </span>
            </div>
            <CardTitle class="text-lg line-clamp-2">{{ article.title }}</CardTitle>
            <CardDescription class="line-clamp-3">{{ article.description }}</CardDescription>
        </CardHeader>

        <CardContent class="pt-0">
            <ArticleTagsComponent :tags="article.tags || []" />
            <!--
            <div v-if="article.tags && article.tags.length" class="flex flex-wrap gap-2">
                <span v-for="tag in article.tags" :key="tag"
                    class="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                    {{ tag }}
                </span>
            </div>-->

        </CardContent>

        <CardFooter class="pt-0">
            <NuxtLink :to="`/articles/${article.stem.split('/')[1]}`"
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