<template>

    <div style="margin-top: 60px !important;">

        <div v-if="loaded">
            
            <div v-if="model.status === 'published'">
                
                <ModelDetails :model="model" :loaded="loaded" />

                <div class="border-b border-gray-200 mt-6">
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

                <div class="p-6">
                    <div v-show="activeTab === 'soft-images'">
                        <ModelImages imgType="Softcore" :categoryTags="softImageTags"  />
                    </div>
                    
                    <div v-show="activeTab === 'soft-galleries'">
                        <ModelGalleries imgType="Softcore" :categoryTags="softGalleryTags" />
                    </div>

                   
                    <div v-show="activeTab === 'hard-images'">
                        <ModelImages imgType="Hardcore" :categoryTags="hardImageTags"  />
                    </div>
                    
                    <div v-show="activeTab === 'hard-galleries'">
                        <ModelGalleries imgType="Hardcore" :categoryTags="hardGalleryTags" />
                    </div>
                   

                    <div v-show="activeTab === 'compilations'">
                        <div class="text-center py-12 text-gray-500">
                            <p>Compilations coming soon</p>
                        </div>
                    </div>
                </div>
             
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

const softImageTags=['Clothed', 'Lingerie', 'Nude', 'Lesbian']
const softGalleryTags=['Solo', 'Masturbation', 'Lesbian']
const hardImageTags=['Preparing For Sex', 'Blowjob', 'Vaginal Sex', 'Anal Sex', 'Vaginal Penetration Closeup', 'Anal Penetration Closeup', 'Creampie', 'Facial', 'Group Sex', 'Group Sex Closeup']
const hardGalleryTags=['Vaginal Sex', 'Anal Sex', 'Group Sex']

//const images = ref([])

const activeTab = ref('soft-images')

const tabs = [
    { id: 'soft-images', name: 'Softcore Images' },
    { id: 'soft-galleries', name: 'Softcore Galleries' },
    { id: 'hard-images', name: 'Hardcore Images' },
    { id: 'hard-galleries', name: 'Hardcore Galleries' },
    { id: 'compilations', name: 'Compilations' }
]
//const activeTab = 'images'


const fetchModelBySlug = async (slug) => {

    try {
        console.log('slug is ', slug)
        const query = `
                  { "slug" : 
                          {"_eq" : "${slug}"} 
                  }
              `
        const response = await fetch(
            `https://latin.dedyn.io/items/models?fields=*.*&filter=${query}&limit=1&offset=0`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        if (!response.ok) throw new Error('Failed to fetch info data');
        const result = await response.json();
        model.value = result.data[0]
    } catch (error) {
        console.log('error', error)
    }
}

/*


const fetchGalleriesBySlug = async (slug) => {
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
            fields: 'title,id,tags.*,image.*,cover_image',
            filter: JSON.stringify(filter)
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
        galleries.value = result.data;

    } catch (error) {
        console.error('❌ error fetching galleries by slug', error);
    }
};
*/

onMounted(async () => {

    await fetchModelBySlug(slug)
    //await fetchGalleriesBySlug(slug)
    //await fetchImagesBySlug(slug)

    loaded.value = true

})



</script>
