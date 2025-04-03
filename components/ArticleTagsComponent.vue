<template>
    <div class="flex flex-wrap gap-2">
        <Badge v-for="tag in tags" :key="tag" variant="secondary" class="hover:bg-secondary/80 transition-colors">
            <NuxtLink :to="`/revista/etiquetas/${tag}`" class="text-current">
                {{ tag }}
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