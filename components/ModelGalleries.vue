<template>
    <section>

        <section>

            <GalleryCarousels :imageCategoryArrays="galleryArrays" :baseCDN="baseCDN" />

        </section>

        <section>
            <section>
                <h2 class="text-xl font-semibold mb-2">All {{ props.imgType }} Galleries</h2>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

                    <div v-for="gallery in galleries" :key="gallery.id"
                        class="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">

                        <NuxtImg
                            :src="gallery.cover_image ? `https://${baseCDN}/${gallery.cover_image} ` : `https://${baseUrl}/assets/29b87019-62c4-4601-baf0-8feced4d00e6`"
                            :alt="gallery.title || 'latina model'"
                            :fallback="`https://${baseUrl}/assets/29b87019-62c4-4601-baf0-8feced4d00e6`"
                            class="w-full h-96 object-cover object-top" loading="lazy" />

                        <div
                            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">

                            <NuxtLink v-if="gallery.title" :to="`/gallery/${gallery.id}/${slugify(gallery.title)}`"
                                class="text-white font-semibold text-md hover:underline">
                                {{ gallery.title }}
                            </NuxtLink>

                        </div>
                    </div>
                </div>

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
                                :disabled="currentPage === totalPages"
                                class="min-w-8 h-8 p-0 flex items-center justify-center">
                                &rsaquo;
                            </Button>
                        </li>
                        <li>
                            <Button variant="outline" @click="changePage(totalPages)"
                                :disabled="currentPage === totalPages"
                                class="min-w-8 h-8 p-0 flex items-center justify-center">
                                &raquo;
                            </Button>
                        </li>
                    </ul>
                </nav>
            </section>


        </section>



    </section>
</template>

<script setup>
const route = useRoute()
const slug = route.params.slug ? route.params.slug[0] : ''
const loaded = ref(false)
const galleries = ref([])
const totalGalleries = ref(0)
const galleryArrays = ref([])
const carouselGalleries = ref([])

// Pagination constants
const ITEMS_PER_PAGE = 10
const currentPage = ref(1)
const MAX_VISIBLE_PAGES = 5

const baseUrl = 'latin.dedyn.io'
const baseCDN = 'square-night-b2b6.moton8n.workers.dev'

const SOFT_LIMIT = 600

const props = defineProps({
    imgType: { type: String, required: true },
    categoryTags: { type: Array, required: true }
});


const fetchGalleriesBySlug = async (slug, page, imgType) => {
    try {
        const offset = (page - 1) * ITEMS_PER_PAGE

        const filter = {
            model: {
                slug: {
                    _eq: slug
                }
            },
            status: {
                _eq: 'published'
            },
            tags: {
                _some: {
                    global_tags_id: {
                        name: {
                            _eq: imgType
                        }
                    }
                }
            }
        };

        const queryParams = new URLSearchParams({
            fields: 'title,id,tags.*,image.*,cover_image',
            filter: JSON.stringify(filter),
            limit: ITEMS_PER_PAGE,
            offset: offset
        });

        const url = `https://${baseUrl}/items/galleries?${queryParams.toString()}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Failed to fetch galleries');

        const result = await response.json();
        console.log('✅ galleries results', result);
        currentPage.value = page
        galleries.value = result.data;

    } catch (error) {
        console.error('❌ error fetching galleries by slug', error);
    }
};

const countGalleries = async (slug, imgType) => {
    try {
        const filter = {
            model: {
                slug: {
                    _eq: slug
                }
            },
            status: {
                _eq: 'published'
            },
            tags: {
                _some: {
                    global_tags_id: {
                        name: {
                            _eq: imgType
                        }
                    }
                }
            }
        };

        const queryParams = new URLSearchParams({
            'aggregate[countDistinct]': 'id',
            filter: JSON.stringify(filter)
        });

        const response = await fetch(
            `https://${baseUrl}/items/galleries?${queryParams.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) throw new Error('Failed to count galleries');

        const result = await response.json();
        totalGalleries.value = result.data[0].countDistinct.id;

    } catch (error) {
        console.error('Error counting galleries for model:', error);
    }
};


const fetchGalleryCarousels = async (slug, imgType) => {

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
        fields: 'title,id,image.*,cover_image,tags.global_tags_id.*,slug,status',
        filter: JSON.stringify(filter),
        limit: SOFT_LIMIT,
    })

    const url = `https://${baseUrl}/items/galleries?${queryParams.toString()}`
    const response = await fetch(url, { headers: { 'Content-Type': 'application/json' } })
    const result = await response.json()
    console.log('carousel galleries', result)
    //console.log('carousel images length', result.data.length)

    carouselGalleries.value = result.data
}



const buildGalleryArrays = (categoryTags) => {
    const categoryMap = {}

    categoryTags.forEach((tag) => {
        categoryMap[tag] = []
    })

    for (const img of carouselGalleries.value) {
        if (!img.tags) continue

        const tagNames = img.tags.map((t) => t.global_tags_id?.name)

        categoryTags.forEach((category) => {
            if (tagNames.includes(category)) {
                categoryMap[category].push(img)
            }
        })
    }

    galleryArrays.value = categoryTags
        .map((tag) => ({
            name: tag,
            galleries: categoryMap[tag],
        }))
        .filter((cat) => cat.galleries.length > 0)
}



// Computed properties for pagination
const totalPages = computed(() => Math.ceil(totalGalleries.value / ITEMS_PER_PAGE));

const visiblePages = computed(() => {
    const pages = [];
    let startPage = 1;
    let endPage = totalPages.value;

    if (totalPages.value > MAX_VISIBLE_PAGES) {
        const half = Math.floor(MAX_VISIBLE_PAGES / 2);
        startPage = Math.max(1, currentPage.value - half);
        endPage = Math.min(totalPages.value, currentPage.value + half);

        if (endPage - startPage + 1 < MAX_VISIBLE_PAGES) {
            if (currentPage.value < totalPages.value / 2) {
                endPage = Math.min(totalPages.value, startPage + MAX_VISIBLE_PAGES - 1);
            } else {
                startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
            }
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return pages;
});

// Change page handler
const changePage = (page) => {
    if (page > 0 && page <= totalPages.value && page !== currentPage.value) {
        fetchGalleriesBySlug(slug, page, props.imgType)
    }
};

onMounted(async () => {
    await fetchGalleriesBySlug(slug, currentPage.value, props.imgType)
    await countGalleries(slug, props.imgType)
    await fetchGalleryCarousels(slug, props.imgType)
    buildGalleryArrays(props.categoryTags)

    console.log('gallery arrays', galleryArrays.value)

    loaded.value = true
})
</script>