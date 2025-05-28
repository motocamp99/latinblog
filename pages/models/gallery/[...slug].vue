<template>

    <div>

        <div v-if="loaded">
            <div v-if="!err404 && gallery.status==='published'" class="px-6">

                
                <GalleryDetails :gallery="gallery" />
                <GalleryImages :images="images" />

            </div>
            <div v-else>
                404 Gallery Not Found

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
const id = route.params.id
const slug = route.params.slug ? route.params.slug[0] : ''
const loaded = ref(false)
let gallery = ref('')
let images = ref([])
let err404 = ref(false)
const baseURL = 'https://latinblog.pages.dev'


const fetchImages = async (id) => {

    const query = `
                  { "gallery" : 
                   {"id" :
                      {"_eq" : ${id}} 
                    } 
                  }
              `

    //const url=`https://latin.dedyn.io/items/images?filter=${query}`
    //const url=`https://latin.dedyn.io/items/images`
    //const url=`https://latin.dedyn.io/items/images?filter[gallery]=${id}&fields=gallery.*`
    //const url=`https://latin.dedyn.io/items/images?filter[gallery]=${id}&fields=id,gallery.name`
    //const url=`https://latin.dedyn.io/items/images?filter[gallery]=${id}&fields=*,gallery.name`
    const url = `https://latin.dedyn.io/items/images?filter[gallery]=${id}&fields=url,fallback_url,gallery.name`

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
    console.log('rr2', result.data)

    images.value = result.data.map(elem => {
        return {
            url: elem.url,
            fallback: elem.fallback_url
        }
    })

}


const fetchGallery = async (id) => {

    //const url=`https://latin.dedyn.io/items/galleries_images/${id}?fields=*,images.images_id.*`
    const url = `https://latin.dedyn.io/items/galleries/${id}?fields=name,tags.*,model.name,model.id,model.slug,referral_1,referral_2,status`

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
    const slugged= slugify(result.data.name)
    console.log('slugged', slugged)
    if (slugged !== slug) {
        err404.value=true;

           throw createError({
            statusCode: 404,
            message: 'Gallery not found'
        })

    }

    gallery.value = result.data
    console.log('gallery', gallery.value)

}


onMounted(async () => {

    //await fetchCategories()
    await fetchGallery(id).catch(err=>console.error('error', err.message))
    await fetchImages(id)

    loaded.value = true

})



</script>
