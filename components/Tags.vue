<template>
    <div class="tags-section mb-10">
        <div class="flex flex-wrap gap-2">
            <!-- 'Todos' tag -->
            <Badge :variant="selectedTag === 'todos' ? 'default' : 'secondary'"
                class="cursor-pointer transition-colors hover:opacity-80" @click="selectTag('todos')">
                <NuxtLink :to="isCategory ? '/revista' : '/revista'" class="text-current no-underline">
                    Todos
                </NuxtLink>
            </Badge>

            <!-- Other tags -->
            <Badge v-for="(count, tag) in tags" :key="tag" :variant="selectedTag === tag ? 'default' : 'primary'"
                class="cursor-pointer transition-colors hover:opacity-80" @click="selectTag(tag)">
                <NuxtLink :to="isCategory ? `/revista/category/${tag}` : `/revista/etiquetas/${tag}`"
                    class="text-current no-underline">
                    {{ tag }} ({{ count }})
                </NuxtLink>
            </Badge>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge'

const props = defineProps({
    tags: {
        type: Object,
        required: true,
    },
    isCategory: {
        type: Boolean,
        default: false
    }
})

const selectedTag = ref('todos')

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