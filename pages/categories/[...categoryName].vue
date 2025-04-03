<template>
    <div>
        <!-- Hero Section -->
        <div v-if="loaded">
            <div class="hero-section">
                {{ allArticles }}
            </div>
                
        </div>
        <div v-else>
            <div class="text-center mt-5" style="height: 600px !important; margin-top: 100px !important;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const categoryName = ref(route.params.categoryName[0]);
const allArticles = ref([]); // Store all fetched articles
const tags = ref({});
const currentPage = ref(1);
const itemsPerPage = 4; // Number of articles per page
const banners = ref([]);
const loaded = ref(false);
const featuredArticles = ref([]);
const selectedTag = ref('todos'); // Default to 'todos' to show all articles


// Fetch banner data from the JSON file
const fetchBanners = async () => {
    const { data } = await useFetch('/assets/magazine/category-banners.json');
    banners.value = data.value;
};

// Find the banner data for the current category
const bannerData = computed(() => {
    const banner = banners.value.find((banner) => {
        const bannerCategory = banner.category.toLowerCase().trim();
        const currentCategory = categoryName.value.toLowerCase().trim();
        return bannerCategory === currentCategory;
    });

    return banner || {
        image: '/assets/images/panty-icon.jpg',
        alt: 'Default Banner',
        caption: 'Categoría: ' + categoryName.value,
    };
});

// Fetch all articles for the category
const fetchAllArticles = async () => {
    const query = queryCollection('blog')
        .where('published', '=', true)
        .where('category', '=', categoryName.value)
        .order('date', 'DESC');

    const { data } = await useAsyncData('blog', () => query.all());
    allArticles.value = data.value;

    // Extract and count tags
    const tagCounts = {};
    allArticles.value.forEach((article) => {
        if (article.tags) {
            article.tags.forEach((tag) => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        }
    });
    tags.value = tagCounts;
};

// Fetch featured articles
const fetchFeaturedArticles = async () => {
    const { data } = await useAsyncData('featured', () =>
        queryCollection('blog')
            .where('category', '=', categoryName.value)
            .where('featured', '=', true)
            .order('date', 'DESC')
            .limit(6)
            .all()
    );
    featuredArticles.value = data.value;
};

// Handle tag selection
const handleTagSelect = (tag) => {
    selectedTag.value = tag;
    currentPage.value = 1; // Reset to the first page when a new tag is selected
};

// Filter articles based on the selected tag
const filteredArticles = computed(() => {
    if (selectedTag.value === 'todos') {
        return allArticles.value; // Show all articles
    }
    return allArticles.value.filter((article) => article.tags && article.tags.includes(selectedTag.value));
});

// Paginate filtered articles
const paginatedArticles = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredArticles.value.slice(start, end);
});

// Total number of pages for filtered articles
const totalPages = computed(() => Math.ceil(filteredArticles.value.length / itemsPerPage));

// Visible pages for pagination
const visiblePages = computed(() => {
    const pages = [];
    const totalVisibleButtons = 5;
    let startPage = currentPage.value - Math.floor(totalVisibleButtons / 2);
    let endPage = currentPage.value + Math.floor(totalVisibleButtons / 2);

    if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(totalVisibleButtons, totalPages.value);
    }
    if (endPage > totalPages.value) {
        endPage = totalPages.value;
        startPage = Math.max(1, endPage - totalVisibleButtons + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
        pages.push(page);
    }

    return pages;
});

// Change page
const changePage = (page) => {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
        //window.scrollTo(0, 0);
    }
};

onMounted(async () => {
    await fetchBanners(); // Fetch banner data
    await fetchAllArticles(); // Fetch all articles for the category
    await fetchFeaturedArticles();
    loaded.value = true;
    window.scrollTo(0, 0);
});

</script>

<style scoped>
.hero-section {
    position: relative;
    height: 70vh;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
}

.banner-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}

.banner-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hero-content {
    z-index: 1;
    background: rgba(0, 0, 0, 0.5);
    /* Semi-transparent overlay */
    /*padding: 20px;*/
    border-radius: 10px;
}

.stats {
    margin-top: 20px;
}

.stat-item {
    background: rgba(255, 255, 255, 0.1);
    padding: 15px 25px;
    border-radius: 15px;
    transition: transform 0.3s ease, background 0.3s ease;
}

.stat-item:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.2);
}
</style>