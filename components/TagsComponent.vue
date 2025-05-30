<template>
    <div >

        <div v-if="isModel" class="flex flex-wrap gap-2">
            <Badge v-for="tag in tags" :key="tag.model_tags_id" :variant="'secondary'"> <!--:variant="'secondary'" to make them grey remove this to make them black-->
                <NuxtLink :to="`/models/tags/${slugify(tag.model_tags_id)}`" class="text-current text-xs md:text-xs">
                    {{ deslugify(tag.model_tags_id) }}
                </NuxtLink>
            </Badge>
        </div>
        <div v-else class="flex flex-wrap gap-2">
            <Badge v-for="tag in tags" :key="tag.post_tags_id" :variant="'secondary'" >
                <NuxtLink :to="`/posts/tags/${slugify(tag.post_tags_id)}`" class="text-current text-xs md:text-xs">
                    {{ deslugify(tag.post_tags_id) }}
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
    }
})
</script>