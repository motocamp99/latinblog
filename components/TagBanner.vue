<!-- components/CategoryBanner.vue -->
<script setup>
defineProps({
    tag: {
        type: Object,
        required: true,
    }
})

</script>

<template>
    <div class="category-banner">
        <!-- Responsive Image with different sizes for different screens -->
        <NuxtImg :src="tag.banner_image?.id ? tag.banner_image.id : '649ba7ca-4874-4dde-a18b-d4026a94265e'" provider="directus" :placeholder="[50, 25, 75]" loading="lazy"
            class="banner-image" :alt="tag.id"
            quality="70"
            sizes="100vw sm:400px md:600px lg:1500px xl:2000px "/>

        <!-- Text overlay centered on image -->
        <div class="text-overlay">
            <h1 class="banner-title">Tag: {{ deslugify(tag.id) }}</h1>
            <p v-if="tag.description" class="banner-description">
                Category : {{ tag.description }}
            </p>
        </div>
    </div>
</template>

<style scoped>
.category-banner {
    position: relative;
    width: 100%;
    overflow: hidden;
}

.banner-image {
    width: 100%;
    height: auto;
    max-height: 65vh;
    object-fit: cover;
    display: block;
}

.text-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2rem;
    box-sizing: border-box;
}

.banner-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0 0 0.5rem 0;
    line-height: 1.2;
}

.banner-description {
    font-size: 1.25rem;
    margin: 0;
    line-height: 1.4;
    opacity: 0.9;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .text-overlay {
        padding: 1.5rem;
    }

    .banner-title {
        font-size: 2rem;
    }

    .banner-description {
        font-size: 1.1rem;
    }
}

@media (max-width: 640px) {
    .text-overlay {
        padding: 1rem;
    }

    .banner-title {
        font-size: 1.75rem;
    }

    .banner-description {
        font-size: 1rem;
    }
}
</style>