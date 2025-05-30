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
    },
    img_height: {
        type: String,
        default: "40vh"
    },
    img_width: {
        type: String,
        default: '33vw'
    },
    minimal: {
        type: Boolean,
        default: false
    }
})

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('es-ES', options)
}
</script>

<template>
    <Card class="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300 p-0">
        <!-- Image container with overlay content -->
        <NuxtLink :to="`/posts/${article.slug ? article.slug : slugify(article.title)}`" class="relative">
            <!-- Image -->
            <div class="overflow-hidden w-full" :style="`height: ${img_height}`">
                <NuxtImg :src="article.image?.id ? `${article.image.id}` : '2df8b198-befd-4aa5-87cb-49f7da84b604'"
                    quality=70 :width=img_width provider="directus" loading="lazy"
                    class="w-full h-full object-cover object-top" />
            </div>

            <!-- Overlay -->
            <div class="absolute inset-0 flex flex-col justify-end">
                <!--absolute inset-0 bg-gradient-to-t from-black/80 to-transparent -->
                <!-- CardHeader content moved to overlay -->
                <CardHeader class="text-white p-3 md:p-2">
                    <div class="flex items-center gap-2 mb-2" v-if="!minimal">
                        <NuxtLink v-if="article.category" :to="`/category/${slugify(article.category.id)}`">
                            <span class="text-xs font-medium px-2 py-1 bg-primary text-primary-foreground rounded-full">
                                {{ deslugify(article.category.id) }}
                            </span>
                        </NuxtLink>
                        <span class="text-xs text-white/80">
                            {{ formatDate(article.date_created) }}
                        </span>
                    </div>
                    <!--
                    <CardTitle class="text-white text-sm md:text-base lg:text-base xl:text-base">
                        {{ article.title }}
                    </CardTitle>
                    -->

                    <!--
                    <CardDescription v-if=" article.description" class="text-white/80 line-clamp-3">
                        {{ article.description.length > 50 ? article.description.slice(0,50)+"..." : article.description  }}
                    </CardDescription>-->
                </CardHeader>
            </div>
        </NuxtLink>

        <!-- Footer with tags and read more link -->
        <CardFooter class="flex flex-col items-start gap-1 p-1 md:p-2">
            <TagsComponent v-if="!minimal" :tags="article.tags.length > 4 ? article.tags.slice(0, 4) : article.tags" />

            <CardTitle class="text-sm md:text-base lg:text-base xl:text-base">
                {{ article.title }}
            </CardTitle>
            <!--
            <NuxtLink :to="`/posts/${article.slug ? article.slug : slugify(article.title)}`"
                class="text-xs font-medium text-primary hover:underline mt-1">
                Leer más →
            </NuxtLink>
            -->
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

/* Ensure the image fills its container */
.w-full {
    width: 100%;
}

.h-full {
    height: 100%;
}

.object-cover {
    object-fit: cover;
}
</style>