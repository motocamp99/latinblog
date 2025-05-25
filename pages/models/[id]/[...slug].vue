<template>

    <div style="margin-top: 60px !important;">

        <div v-if="loaded">
            <div v-if="model.status === 'published'">
                <ModelDetails :model="model" :loaded="loaded" />

                <!-- Tabs Navigation -->
                <div class="border-b border-gray-200">
                    <nav class="flex space-x-8 px-6 gap-2">
                        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                            'py-4 px-1 border-b-2 font-medium text-sm',
                            activeTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        ]">
                            {{ tab.name }}
                        </button>
                    </nav>
                </div>

                <!-- Tab Panels -->
                <div class="p-6">
                    <div v-show="activeTab === 'images'">
                        <ModelImages :images="images" />
                    </div>

                    <div v-show="activeTab === 'galleries'">
                        <GalleriesGrid :galleries="galleries" />
                    </div>

                    <div v-show="activeTab === 'compilations'">
                        <div class="text-center py-12 text-gray-500">
                            <p>Compilations coming soon</p>
                        </div>
                    </div>
                </div>

                <!--
                <ModelDetails :model="model" :loaded="loaded" />
                <div class="p-6">
                    <GalleriesGrid :galleries="galleries" />
                </div>

                <div class="p-6">
                    <ModelImages :images="images" />
                </div>
                -->
            </div>

            <div v-else>
                Coming Soon
            </div>


        </div>
        <div v-else class="flex justify-center items-center h-64">
            <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
            </svg>
            <span class="sr-only">Loading...</span>
        </div>

    </div>

</template>



<script setup>

const route = useRoute()
const id = route.params.id //model id
const slug = route.params.slug ? route.params.slug[0] : ''
const loaded = ref(false)
let model = ref({})
const galleries = ref([])
const images = ref([])

const activeTab = ref('images')

const tabs = [
  { id: 'images', name: 'Images' },
  { id: 'galleries', name: 'Galleries' },
  { id: 'compilations', name: 'Compilations' }
]
//const activeTab = 'images'

const fetchModel = async (id) => {

    const response = await fetch(

        `https://latin.dedyn.io/items/models/${id}/?fields=*.*`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
    if (!response.ok) throw new Error('Failed to fetch info data');
    const result = await response.json();
    console.log('rr', result)
    model.value = result.data
    //console.log('resulted article', result.data)
    //console.log('gallll', articleImages.value.map(elem=>elem.directus_files_id))

}


const fetchGalleries = async (id) => {

    const url = `https://latin.dedyn.io/items/galleries/?fields=name,id,tags.tags_id,image.*&filter[model][id][_eq]=${id}`

    const response = await fetch(

        url,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
    if (!response.ok) throw new Error('Failed to fetch info data');
    const result = await response.json();
    console.log('rresults', result)
    galleries.value = result.data
    //console.log('resulted article', result.data)
    //console.log('gallll', articleImages.value.map(elem=>elem.directus_files_id))

}

const fetchImages = async (id) => {

    const url = `https://latin.dedyn.io/items/images?fields=url,fallback_url,status,alt,gallery.id,gallery.name,tags.tags_id&filter[model][id][_eq]=${id}`
    //const url=`https://latin.dedyn.io/items/images?fields=*.*&filter[model][id][_eq]=${id}`

    const response = await fetch(

        url,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
    if (!response.ok) throw new Error('Failed to fetch info data');
    const result = await response.json();
    console.log('images rresults', result)
    images.value = result.data
    //galleries.value = result.data
    //console.log('resulted article', result.data)
    //console.log('gallll', articleImages.value.map(elem=>elem.directus_files_id))

}


onMounted(async () => {

    //await fetchCategories()
    await fetchModel(id)
    await fetchGalleries(id)
    await fetchImages(id)

    loaded.value = true

})



</script>
