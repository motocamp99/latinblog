<template>
    <div class="flex flex-wrap gap-2">
        <Badge v-for="tag in tags" :key="tag">
            <NuxtLink :to="`/models/tags/${tag.post_tags_id.toLowerCase()}`" class="text-current">
                {{ tag.post_tags_id }}
            </NuxtLink>
        </Badge>
    </div>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge'

defineProps({
    tags: {
        type: Array as PropType<string[]>,
        default: () => []
    }
})
</script>