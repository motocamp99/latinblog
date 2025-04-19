<template>
    <div class="flex flex-wrap gap-2">
        <Badge v-for="tag in tags" :key="tag">
            <NuxtLink :to="`/revista/etiquetas/${tag.toLowerCase()}`" class="text-current">
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