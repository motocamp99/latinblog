<template>
    <div>
        <div v-if="isModel" class="flex flex-wrap gap-2">
            <Badge v-for="tag in tags" :key="tag.model_tags_id" variant="secondary">
                <NuxtLink :to="`/models/tags/${slugify(tag.model_tags_id)}`" class="text-current text-xs md:text-xs">
                    {{ deslugify(tag.model_tags_id) }}
                </NuxtLink>
            </Badge>
        </div>
        <div v-else-if="isPost" class="flex flex-wrap gap-2">
            <Badge v-for="tag in tags" :key="tag.post_tags_id" variant="secondary">
                <NuxtLink :to="`/posts/tags/${slugify(tag.post_tags_id)}`" class="text-current text-xs md:text-xs">
                    {{ deslugify(tag.post_tags_id) }}
                </NuxtLink>
            </Badge>
        </div>
        <div v-else-if="isGallery" class="flex flex-wrap gap-2">
            <Badge v-for="tag in tags" :key="tag.global_tags_id.id" variant="secondary">
                <NuxtLink :to="`/galleries/tags/${tag.global_tags_id.slug}`" class="text-current text-xs md:text-xs">
                    {{ tag.global_tags_id.name }}
                </NuxtLink>
            </Badge>
        </div>
        <div v-else-if="isImage" class="flex flex-wrap gap-1">

            <!-- Smaller tags for images -->
            <div v-for="tag in tags" :key="tag.global_tags_id.id" class="image-tag">
                <NuxtLink :to="`/images/tags/${tag.global_tags_id.slug}`" >
                    <strong> {{ tag.global_tags_id.name }} </strong> 
                </NuxtLink>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge'

defineProps({
    tags: {
        type: Array as PropType<string[]>,
        default: () => []
    },
    isModel: { type: Boolean, default: false },
    isPost: { type: Boolean, default: false },
    isGallery: { type: Boolean, default: false },
    isImage: { type: Boolean, default: false }
})
</script>

<style scoped>
.image-tag {
    padding: 0.1rem 0.3rem !important;
    margin: 0 !important;
    font-size: 0.6rem !important;
    line-height: 1rem;
    border-radius: 0.25rem !important;
    min-width: unset !important;
    height: auto !important;
    /*color: #fff;*/
    /* optionally tweak background opacity if needed */
    background-color: rgba(255, 255, 255, 0.629) !important;
}
</style>