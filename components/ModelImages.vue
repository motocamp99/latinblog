<template>
  <section>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div v-for="(image, index) in images" :key="image.url + index"
        class="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
        <!--{{ image }}-->
        <NuxtImg :src="`https://square-night-b2b6.moton8n.workers.dev/${image.url}`"
          :alt="image.alt || image.gallery?.title || 'latina model'"
          :fallback="image.fallback_url || '/placeholder.jpg'" class="w-full h-64 object-cover" loading="lazy" />

        <div
          class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">

          <NuxtLink v-if="image.gallery" :to="`/gallery/${image.gallery.id}/${slugify(image.gallery.title)}`"
            class="text-white font-semibold text-md hover:underline">
            {{ image.gallery?.title }}
          </NuxtLink>

          <div v-if="image.tags && image.tags.length > 0" class="flex flex-wrap gap-2 mt-2">
            <span v-for="(tag, index) in image.tags" :key="index"
              class="px-2 py-1 bg-white/20 text-white text-xs rounded-full backdrop-blur-sm">
              {{ tag.tags_id }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <nav aria-label="Page navigation" class="mt-8 mb-12">
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
          <Button variant="outline" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
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
const images = ref([])
const totalImages = ref(0)

const ITEMS_PER_PAGE = 4
const currentPage = ref(1);
const MAX_VISIBLE_PAGES = 5;


const fetchImagesBySlug = async (slug , page) => {

  try {

    const offset = (page - 1) * ITEMS_PER_PAGE;

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

    //limit=${ITEMS_PER_PAGE}&offset=${offset}

    const queryParams = new URLSearchParams({
      fields: 'url,fallback_url,status,alt,gallery.id,gallery.title,tags.*',
      filter: JSON.stringify(filter),
      limit: ITEMS_PER_PAGE,
      offset : offset
    });

    const url = `https://latin.dedyn.io/items/images?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch galleries');

    const result = await response.json();
    console.log('✅ images results', result);
    currentPage.value = page;
    images.value = result.data;

  } catch (error) {
    console.error('❌ error fetching images by performer', error);
  }
}


const countImages = async (slug) => {
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
      `https://latin.dedyn.io/items/images?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) throw new Error('Failed to count images');

    const result = await response.json();

    totalImages.value = result.data[0].count;

  } catch (error) {
    console.error('Error counting images for model:', error);
  }
};


const totalPages = computed(() => Math.ceil(totalImages.value / ITEMS_PER_PAGE));

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
    //fetchModels(page);
    fetchImagesBySlug(slug , page)
    //window.scrollTo({ top: 3000, behavior: 'smooth' });
  }

  console.log('page', page)
};



onMounted(async () => {

  await fetchImagesBySlug(slug , currentPage.value)
  await countImages(slug)

  console.log('total images', totalImages.value)
  loaded.value = true

})



</script>