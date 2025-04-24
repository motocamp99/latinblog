<template>
    <div class="flex flex-wrap gap-2">
        <Badge v-for="tag in tags" :key="tag.tags_id" :variant="'secondary'" >
            <NuxtLink :to="`/tags/${slugify(tag.tags_id)}`" class="text-current">
                {{ tag.tags_id }}
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