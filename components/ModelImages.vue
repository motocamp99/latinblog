<template>
    <section>

        
        <section class="my-5">
            <ImagesCategoryCarousels :imageCategoryArrays="imageCategoryArrays" :baseCDN="baseCDN" />
        </section>

        <!--<h2 class="text-xl font-semibold mb-2">All Images </h2>-->
        <h2 class="text-xl font-semibold mb-2">All {{ props.imgType }} Images </h2>

        <div class="flex flex-wrap gap-2 justify-start">
            <div v-for="(image, index) in images" :key="image.url + index"
                class="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 gallery-hoverable"
                style="height: 400px; flex-grow: 1; flex-basis: auto" @click="openLightbox(index)">

                <NuxtImg :src="`https://${baseCDN}/${image.url.replace(/^1280\//, '/460/')}`"
                    :alt="image.alt || image.gallery?.title || 'latina model'"
                    :fallback="image.fallback_url || '/placeholder.jpg'" class="h-full w-full object-cover object-top"
                    loading="lazy" />

                <div
                    class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <NuxtLink v-if="image.gallery" :to="`/gallery/${image.gallery.id}/${slugify(image.gallery.title)}`"
                        class="text-white font-semibold text-xs hover:underline">
                        {{ image.gallery?.title }}
                    </NuxtLink>

                    <div v-if="image.tags && image.tags.length > 0" class="flex flex-wrap gap-2 mt-2">
                        <TagsComponent :tags="image.tags" :isImage="true" />
                    </div>
                </div>
            </div>
        </div>

        <VueEasyLightbox :visible="visible" :imgs="lightboxImages" :index="lightboxIndex" @hide="handleHide" />

        <nav aria-label="Page navigation" class="mt-8 mb-12">
            <ul class="flex justify-center lg:justify-start flex-wrap gap-1">
                <li>
                    <Button variant="outline" @click="changePage(1)" :disabled="currentPage === 1"
                        class="min-w-8 h-8 p-0 flex items-center justify-center">
                        &laquo;
                    </Button>
                </li>
                <li>
                    <Button variant="outline" @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                        class="min-w-8 h-8 p-0 flex items-center justify-center">
                        &lsaquo;
                    </Button>
                </li>
                <li v-for="page in visiblePages" :key="page">
                    <Button variant="outline" @click="changePage(page)" :class="{
                        'bg-primary text-primary-foreground': page === currentPage,
                    }" class="min-w-8 h-8 p-0 flex items-center justify-center">
                        {{ page }}
                    </Button>
                </li>
                <li>
                    <Button variant="outline" @click="changePage(currentPage + 1)"
                        :disabled="currentPage === totalPages" class="min-w-8 h-8 p-0 flex items-center justify-center">
                        &rsaquo;
                    </Button>
                </li>
                <li>
                    <Button variant="outline" @click="changePage(totalPages)" :disabled="currentPage === totalPages"
                        class="min-w-8 h-8 p-0 flex items-center justify-center">
                        &raquo;
                    </Button>
                </li>
            </ul>
        </nav>
        
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import VueEasyLightbox from 'vue-easy-lightbox'

const route = useRoute()
const slug = route.params.slug ? route.params.slug[0] : ''
const loaded = ref(false)
const images = ref([])
const totalImages = ref(0)

const ITEMS_PER_PAGE = 20
const currentPage = ref(1)
const MAX_VISIBLE_PAGES = 5
const baseUrl = 'latin.dedyn.io'
const baseCDN = 'square-night-b2b6.moton8n.workers.dev'
const SOFT_LIMIT = 600
const carouselImages = ref([])


const props = defineProps({
    imgType: { type: String, required: true },
    categoryTags: { type: Array, required: true }
});


const imageCategoryArrays = ref([])

const visible = ref(false)
const lightboxIndex = ref(0)

const openLightbox = (idx) => {
    lightboxIndex.value = idx
    visible.value = true
}

const handleHide = () => {
    visible.value = false
}

const lightboxImages = computed(() =>
    images.value.map((img) =>
        `https://${baseCDN}/${img.url}` // use original full image path
    )
)

const fetchImagesBySlug = async (slug, page, imgType ) => {
    const offset = (page - 1) * ITEMS_PER_PAGE
    const filter = {
        model: { slug: { _eq: slug } },
        status: { _eq: 'published' },
        tags: {
            _some: {
                global_tags_id: {
                    name: {
                        _eq: imgType
                    }
                }
            }
        }
    }

    const queryParams = new URLSearchParams({
        fields: 'url,fallback_url,status,alt,gallery.id,gallery.title,tags.global_tags_id.*',
        filter: JSON.stringify(filter),
        limit: ITEMS_PER_PAGE,
        offset
    })

    const url = `https://${baseUrl}/items/images?${queryParams.toString()}`
    const response = await fetch(url, { headers: { 'Content-Type': 'application/json' } })
    const result = await response.json()
    //console.log('images', result)

    currentPage.value = page
    images.value = result.data
}

const fetchCarouselImagesBySlug = async (slug, imgType) => {

    const filter = {
        model: { slug: { _eq: slug } },
        status: { _eq: 'published' },
        tags: {
            _some: {
                global_tags_id: {
                    name: {
                        _eq: imgType
                    }
                }
            }
        }
    }

    const queryParams = new URLSearchParams({
        fields: 'url,fallback_url,status,alt,gallery.id,gallery.title,tags.global_tags_id.*',
        filter: JSON.stringify(filter),
        limit: SOFT_LIMIT,
    })

    const url = `https://${baseUrl}/items/images?${queryParams.toString()}`
    const response = await fetch(url, { headers: { 'Content-Type': 'application/json' } })
    const result = await response.json()
    //console.log('images', result)
    console.log('carousel images length', result.data.length)

    carouselImages.value = result.data
}



const buildImageCategoryArrays = (categoryTags) => {
    const categoryMap = {}

    categoryTags.forEach((tag) => {
        categoryMap[tag] = []
    })

    for (const img of carouselImages.value) {
        if (!img.tags) continue

        const tagNames = img.tags.map((t) => t.global_tags_id?.name)

        categoryTags.forEach((category) => {
            if (tagNames.includes(category)) {
                categoryMap[category].push(img)
            }
        })
    }

    imageCategoryArrays.value = categoryTags
        .map((tag) => ({
            name: tag,
            images: categoryMap[tag],
        }))
        .filter((cat) => cat.images.length > 0)
}

const countImages = async (slug , imgType) => {
    const filter = {
        model: { slug: { _eq: slug } },
        status: { _eq: 'published' },
        tags: {
            _some: {
                global_tags_id: {
                    name: {
                        _eq: imgType
                    }
                }
            }
        }
    }

    const queryParams = new URLSearchParams({
        'aggregate[countDistinct]': 'id',
        filter: JSON.stringify(filter)
    })

    const response = await fetch(
        `https://${baseUrl}/items/images?${queryParams.toString()}`,
        { headers: { 'Content-Type': 'application/json' } }
    )

    const result = await response.json()
    totalImages.value = result.data[0].countDistinct.id
}

const totalPages = computed(() => Math.ceil(totalImages.value / ITEMS_PER_PAGE))

const visiblePages = computed(() => {
    const pages = []
    let start = Math.max(1, currentPage.value - 2)
    let end = Math.min(totalPages.value, start + MAX_VISIBLE_PAGES - 1)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
})

const changePage = (page) => {
    if (page > 0 && page <= totalPages.value && page !== currentPage.value) {
        fetchImagesBySlug(slug, page , props.imgType)
    }
}

onMounted(async () => {
    
    await fetchImagesBySlug(slug, currentPage.value, props.imgType)
    await countImages(slug, props.imgType)
    await fetchCarouselImagesBySlug(slug , props.imgType)
    console.log('props cat', props.categoryTags )
    buildImageCategoryArrays(props.categoryTags)

    
    //console.log('props', props.categoryTags )

    loaded.value = true
})
</script>

<style scoped>
.gallery-hoverable {
    cursor: zoom-in;
}
</style>
