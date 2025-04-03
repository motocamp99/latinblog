<template>
    <div class="social-links">
        <h3 class="text-lg font-semibold mb-3">Redes Sociales</h3>
        <div class="flex flex-wrap gap-2">
            <Badge v-for="(link, platform) in socialLinks" v-if="link" :key="platform" variant="outline"
                class="hover:bg-accent transition-colors">
                <a :href="link" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2">
                   <!--- <Icon :name="getIconName(platform)" class="w-4 h-4" />-->
                    <span>@{{ getUsername(link) }}</span>
                </a>
            </Badge>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge'

const props = defineProps({
    socialLinks: {
        type: Object as PropType<{
            ig?: string
            fb?: string
            x?: string
        }>,
        default: () => ({})
    }
})

const getIconName = (platform: string) => {
    const icons: Record<string, string> = {
        ig: 'ri:instagram-line',
        fb: 'ri:facebook-line',
        x: 'ri:twitter-x-line'
    }
    return icons[platform] || 'ri:share-line'
}

const getUsername = (url: string) => {
    try {
        const urlObj = new URL(url)
        const pathParts = urlObj.pathname.split('/').filter(part => part)
        return pathParts[pathParts.length - 1]
    } catch {
        return 'usuario'
    }
}
</script>