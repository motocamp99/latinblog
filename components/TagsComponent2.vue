<template>
    <div >

        <div v-if="isModel" class="flex flex-wrap gap-2">
            <Badge v-for="tag in tags" :key="tag.model_tags_id" :variant="'secondary'"> <!--:variant="'secondary'" to make them grey remove this to make them black-->
                <NuxtLink :to="`/models/tags/${slugify(tag.model_tags_id)}`" class="text-current text-xs md:text-xs">
                    {{ deslugify(tag.model_tags_id) }}
                </NuxtLink>
            </Badge>
        </div>
        <div v-else-if="isPost" class="flex flex-wrap gap-2">
            <Badge v-for="tag in tags" :key="tag.post_tags_id" :variant="'secondary'" >
                <NuxtLink :to="`/posts/tags/${slugify(tag.post_tags_id)}`" class="text-current text-xs md:text-xs">
                    {{ deslugify(tag.post_tags_id) }}
                </NuxtLink>
            </Badge>
        </div>
        <div v-else-if="isGallery" class="flex flex-wrap gap-2">
            <Badge v-for="tag in tags" :key="tag.global_tags_id.id" :variant="'secondary'" >
                <NuxtLink :to="`/galleries/tags/${tag.global_tags_id.slug}`" class="text-current text-xs md:text-xs">
                    {{ tag.global_tags_id.name }}
                </NuxtLink>
            </Badge>
        </div>
        <div v-else-if="isImage" class="flex flex-wrap gap-2">

            <!--here you can replace badge with custom code to improve tags , the font size should be 0.5 rem and you can set the best padding you consider-->
            <Badge v-for="tag in tags" :key="tag.global_tags_id.id" :variant="'secondary'" style="padding-left:0.1rem !important; padding-right:0.1rem !important;  margin: 0 !important;" >
                <NuxtLink :to="`/images/tags/${tag.global_tags_id.slug}`" class="text-current text-xs md:text-xs" style="font-size: 0.6rem !important;" > <!--here -->
                    {{ tag.global_tags_id.name }}
                </NuxtLink>
            </Badge>
           
        </div>

    </div>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge'

defineProps({
    tags: {
        type: Array as PropType<string[]>,
        default: () => []
    }, isModel: {
        type: Boolean,
        default: false
    },isPost: {
        type: Boolean,
        default: false
    },isGallery: {
        type: Boolean,
        default: false
    }, isImage: {
        type: Boolean,
        default: false
    }
})
</script>