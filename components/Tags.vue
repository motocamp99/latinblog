<template>
    <div class="tags-section mb-10">
        <div class="flex flex-wrap gap-2">
            <!-- "All" tag -->
            <Badge :variant="selectedTag === 'todos' ? 'default' : 'secondary'"
                class="cursor-pointer transition-colors hover:opacity-80" @click="handleTagClick('todos')">
                <span class="text-current no-underline">
                    Todos
                </span>
            </Badge>

            <!-- Tags list -->
            <Badge v-for="tag in sortedTags" :key="tag.id" :variant="selectedTag === tag.id ? 'default' : 'primary'"
                class="cursor-pointer transition-colors hover:opacity-80" @click="handleTagClick(tag.id)">
                <NuxtLink :to="categorySlug ?`/category/${categorySlug}/${slugify(tag.id)}` : `/tags/${slugify(tag.id)}` ">
                    {{ tag.id }} {{ tag.count ? `(${tag.count})` : '' }}
                </NuxtLink>
            </Badge>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { computed, ref } from 'vue'
import type { PropType } from 'vue'

interface Tag {
    id: string
    count: number
}

const props = defineProps({
    tags: {
        type: Array as PropType<Tag[]>,
        required: true,
        default: () => []
    },
    /*
    isCategory: {
        type: Boolean,
        default: false
    }*/
   categorySlug:{
    type: String
   }
})

const emit = defineEmits(['tag-selected'])

const selectedTag = ref<string>('todos')

// Sort tags by count (descending)
const sortedTags = computed(() => {
    return [...props.tags].sort((a, b) => b.count - a.count)
})

const handleTagClick = (tagId: string) => {
    selectedTag.value = tagId
    emit('tag-selected', tagId)
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