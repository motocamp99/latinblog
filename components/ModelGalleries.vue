<template>
    <section>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div v-for="gallery in galleries" :key="gallery.id"
                class="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">

                <NuxtImg
                    :src="gallery.cover_image ? `https://square-night-b2b6.moton8n.workers.dev/${gallery.cover_image}` : 'https://latin.dedyn.io/assets/29b87019-62c4-4601-baf0-8feced4d00e6'"
                    :alt="gallery.title || 'latina model'"
                    :fallback="'https://latin.dedyn.io/assets/29b87019-62c4-4601-baf0-8feced4d00e6'"
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

        <nav aria-label="Page navigation" class="mt-8 mb-12" v-if="totalPages > 1">
            <ul class="flex justify-center lg:justify-start flex-wrap gap-1">
                <li>
                    <Button variant="outline" @click="changePage(1)" :disabled="currentPage === 1">
                        Primero
                    </Button>
                </li>
                <li>
                    <Button variant="outline" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
                        Anterior
                    </Button>
                </li>
                <li v-for="page in visiblePages" :key="page">
                    <Button variant="outline" @click="changePage(page)" :class="{
                        'bg-primary text-primary-foreground': page === currentPage,
                    }">
                        {{ page }}
                    </Button>
                </li>
                <li>
                    <Button variant="outline" @click="changePage(currentPage + 1)"
                        :disabled="currentPage === totalPages">
                        Siguiente
                    </Button>
                </li>
                <li>
                    <Button variant="outline" @click="changePage(totalPages)" :disabled="currentPage === totalPages">
                        Último
                    </Button>
                </li>
            </ul>
        </nav>
    </section>
</template>

<script setup>
const route = useRoute()
const slug = route.params.slug ? route.params.slug[0] : ''
const loaded = ref(false)
const galleries = ref([])
const totalGalleries = ref(0)

// Pagination constants
const ITEMS_PER_PAGE = 4
const currentPage = ref(1)
const MAX_VISIBLE_PAGES = 5

const fetchGalleriesBySlug = async (slug, page = 1) => {
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
            }
        };

        const queryParams = new URLSearchParams({
            fields: 'title,id,tags.*,image.*,cover_image',
            filter: JSON.stringify(filter),
            limit: ITEMS_PER_PAGE,
            offset: offset
        });

        const url = `https://latin.dedyn.io/items/galleries?${queryParams.toString()}`;

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

const countGalleries = async (slug) => {
    try {
        const filter = {
            model: {
                slug: {
                    _eq: slug
                }
            },
            status: {
                _eq: 'published'
            }
        };

        const queryParams = new URLSearchParams({
            'aggregate[count]': '*',
            filter: JSON.stringify(filter)
        });

        const response = await fetch(
            `https://latin.dedyn.io/items/galleries?${queryParams.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) throw new Error('Failed to count galleries');

        const result = await response.json();
        totalGalleries.value = result.data[0].count;

    } catch (error) {
        console.error('Error counting galleries for model:', error);
    }
};

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
        fetchGalleriesBySlug(slug, page)
    }
};

onMounted(async () => {
    await fetchGalleriesBySlug(slug, currentPage.value)
    await countGalleries(slug)
    loaded.value = true
})
</script>