<template>
    <div v-if="loaded && model" class="max-w-7xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
        <!-- Header -->
        <div class="flex flex-col md:flex-row gap-6 mb-10">
            <!-- Model Image -->
            <div class="w-full md:w-1/3 bg-gray-100 rounded-xl overflow-hidden">
                <img v-if="model.image" :src="`https://latin.dedyn.io/assets/${model.image.id}`"
                    :alt="model.image.title" class="w-full h-full object-cover">
                <div v-else class="h-full flex items-center justify-center text-gray-500 py-10">No Image</div>
            </div>

            <!-- Basic Info -->
            <div class="w-full md:w-2/3 space-y-3">
                <h1 class="text-4xl font-extrabold text-gray-900">{{ model.name }}</h1>
                <div class="flex flex-wrap gap-2">
                    <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold"
                        v-if="model.featured">Featured</span>
                    <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">{{
                        model.category?.id || 'Sin categoría' }}</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div><strong>Age:</strong> {{ calculateAge(model.birthdate) }}</div>
                    <div><strong>Country:</strong> {{ model.country || 'Unknown' }}</div>
                    <div><strong>Height:</strong> {{ model.height_cm ? model.height_cm + ' cm' : 'N/A' }}</div>
                    <div><strong>Weight:</strong> {{ model.weight ? model.weight + ' kg' : 'N/A' }}</div>
                    <div><strong>Measurements:</strong> {{ model.measurements || 'N/A' }}</div>
                    <div><strong>Eye Color:</strong> {{ model.eye_color || 'N/A' }}</div>
                    <div><strong>Hair Color:</strong> {{ model.hair_color || 'N/A' }}</div>
                    <div><strong>Fake Tits:</strong> {{ model.fake_tits || 'N/A' }}</div>
                    <div><strong>Anal:</strong> {{ model.anal ? 'Yes' : 'No' }}</div>
                    <div><strong>Tattoos:</strong> {{ model.tattoos || 'None' }}</div>
                    <div><strong>Piercings</strong> {{ model.piercings || 'None' }}</div>
                    <div><strong>Career</strong> {{ model.career_length  || 'Unknown' }}</div>
                </div>

            </div>
        </div>

        <!-- Biography / Details -->
        <div v-if="model.details" class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-3">Bio</h2>
            <p class="text-gray-700 whitespace-pre-line">{{ model.details }}</p>
        </div>

        <!-- Aliases -->
        <div v-if="model.alias_list?.length" class="mb-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-2">Aliases</h2>
            <ul class="list-disc list-inside text-gray-600">
                <li v-for="alias in model.alias_list" :key="alias">{{ alias }}</li>
            </ul>
        </div>

        <!-- Social URLs -->

        <div v-if="model.urls?.length" class="mb-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-2">Social Media</h2>
            <div class="flex flex-wrap gap-4">
                <a v-for="(url, index) in model.urls" :key="index" :href="url" target="_blank" rel="noopener noreferrer"
                    class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-blue-600">
                    {{ cleanUrl(url) }}
                </a>
            </div>
        </div>

        <div v-if="model.urls?.length" class="mb-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-2">Tags</h2>
            <div class="flex flex-wrap gap-4">
                <TagsComponent :tags="model.tags" :isModel="true" />
            </div>
        </div>

        <!-- Metadata -->
        <div class="border-t border-gray-200 pt-4 text-sm text-gray-500 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><strong>Created:</strong><br> {{ formatDate(model.date_created) }}</div>
            <div><strong>Updated:</strong><br> {{ formatDate(model.date_updated) }}</div>
        </div>
    </div>

    <!-- Loading -->
    <div v-else class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
</template>

<script setup>
const props = defineProps({
    model: { type: Object, required: true },
    loaded: { type: Boolean, required: true }
});

const calculateAge = (birthdate) => {
    if (!birthdate) return 'Desconocida';
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const cleanUrl = (url) => {
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch {
        return url;
    }
};
</script>

<style scoped>
ul {
    padding-left: 1rem;
}
</style>
