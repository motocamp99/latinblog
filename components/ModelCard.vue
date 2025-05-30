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
    model: {
        type: Object,
        required: true,
        default: () => ({
            name: 'No name',
            bio: 'No bio',
            image: null,
            date_created: '',
            category: null,
            tags: [],
            country: '',
            age: ''
        })
    },
    img_height: {
        type: String,
        default: "40vh"
    },
    img_width: {
        type: String,
        default: '33vw'
    }, minimal: {
        type: Boolean,
        default: false
    }
})

const calculateAge = (birthdate: string) => {
    const birthDate = new Date(birthdate)
    const diff = Date.now() - birthDate.getTime()
    const ageDate = new Date(diff)
    return Math.abs(ageDate.getUTCFullYear() - 1970)
}

const formatDate = (dateString: string) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('es-ES', options)
}
</script>

<template>
    <Card class="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300 w-12/12 ">

        <NuxtLink :to="`/models/${model.id}/${model.slug || slugify(model.name)}`">
            <div class="overflow-hidden h-96 md:h-96"> <!--:style="`height: ${img_height}`"-->
                <NuxtImg :src="model.image?.id ? `${model.image.id}` : '2df8b198-befd-4aa5-87cb-49f7da84b604'"
                    quality="70" :width="img_width" provider="directus" loading="lazy"
                    class="w-full h-full object-cover object-top" />
            </div>
        </NuxtLink>

        <CardHeader class="flex-grow p-3 md:p-6">
            <div class="flex items-center gap-2 mb-2" v-if="!minimal">
                <NuxtLink v-if="model.category" :to="`/models/category/${slugify(model.category.id)}`">
                    <span class="text-xs font-medium px-2 py-1 bg-primary text-primary-foreground rounded-full">
                        {{ deslugify(model.category.id) }}
                    </span>
                </NuxtLink>
            </div>
            <div>
                <span v-if="model.age" class="text-xs text-muted-foreground">
                    {{ calculateAge(model.age) }} años
                </span>
                <span v-if="model.country" class="text-xs text-muted-foreground">
                    • {{ model.country }}
                </span>
            </div>
            <CardTitle class="text-sm md:text-base lg:text-base xl:text-base line-clamp-2">{{ model.name }}</CardTitle>
            <CardDescription v-if="!minimal" class="line-clamp-3">{{ model.bio }}</CardDescription>
        </CardHeader>

        <CardContent class="pt-0" v-if="!minimal">
            <div class="flex flex-wrap gap-1">
                <TagsComponent :tags="model.tags" isModel="true" />
                <!--
                <span v-for="tag in model.tags" :key="tag.model_tags_id"
                    class="text-xs px-2 py-1 bg-muted rounded-full">
                    {{ tag.model_tags_id }}
                </span>-->

            </div>
        </CardContent>

        <CardFooter class="pt-0">
            <NuxtLink :to="`/models/${model.id}/${model.slug || slugify(model.name)}`"
                class="text-sm font-medium text-primary hover:underline">
                Ver más →
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
</style>