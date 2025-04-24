<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps({
    htmlContent: {
        type: String,
        required: true,
    },
})

const tocItems = ref<{ id: string; text: string }[]>([])

// Improved slugify function that handles special characters
const slugify_2 = (text: string) => {
    return text
        .toLowerCase()
        .replace(/\?/g, '')        // Remove question marks first
        .replace(/[^\w\s-]/g, '')  // Remove all non-word chars except spaces and hyphens
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, '')   // Remove leading/trailing hyphens
}

// Parse HTML and extract headings
onMounted(() => {
    if (props.htmlContent) {
        const parser = new DOMParser()
        const doc = parser.parseFromString(props.htmlContent, 'text/html')
        const headings = doc.querySelectorAll('h2')

        tocItems.value = Array.from(headings).map((heading) => {
            const text = heading.textContent || ''
            const id = slugify_2(text) || 'section' // Fallback if empty
            heading.id = id // Assign ID for anchor links
            return { id, text }
        })

        // Optional: Log for debugging
        console.log('Generated TOC items:', tocItems.value)
    }
})

// More robust scroll function
const scrollToHeading = (id: string) => {
    try {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        } else {
            console.warn(`Element with ID "${id}" not found`)
        }
    } catch (error) {
        console.error('Error scrolling to heading:', error)
    }
}
</script>

<template>
    <aside class="sticky top-4 h-min w-64">
        <div class="space-y-2">
            <ul class="space-y-1">
                <li v-for="item in tocItems" :key="item.id">
                    <a @click.prevent="scrollToHeading(item.id)"
                        class="text-gray-600 hover:text-primary cursor-pointer">
                        {{ item.text }}
                    </a>
                </li>
            </ul>
        </div>
    </aside>
</template>