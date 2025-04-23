<template>
    <div class="tags-section mb-10">
        <div class="flex flex-wrap gap-2">
            <!-- Tags list -->
            <Badge v-for="tag in tags" :key="tag.id" :variant="selectedTag === tag.id ? 'default' : 'primary'"
                class="cursor-pointer transition-colors hover:opacity-80" @click="selectTag(tag.id)">
                <NuxtLink :to="isCategory ? `/category/${tag.id}` : `/tags/${tag.id.toLowerCase()}`"
                    class="text-current no-underline">
                    {{ tag.id }}
                </NuxtLink>
            </Badge>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import type { PropType } from 'vue'

interface Tag {
    id: string
}

const props = defineProps({
    tags: {
        type: Array as PropType<Tag[]>,
        required: true,
        default: () => []
    },
    isCategory: {
        type: Boolean,
        default: false
    }
})

const selectedTag = ref<string>('todos')

const selectTag = (tag: string) => {
    selectedTag.value = tag
}
</script>

<style scoped>
.tags-section {
    /* Custom styles if needed */
}

/* If you want to customize the badge colors further */
:deep(.bg-primary) {
    background-color: hsl(var(--primary));
}

:deep(.bg-secondary) {
    background-color: hsl(var(--secondary));
}
</style>