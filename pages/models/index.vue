<template>
    <div style="margin-top: 300px !important;">
        testing
    </div>
    
</template>



<script setup>


const fetchModel=async(id)=>{

const response = await fetch(

  `https://latin.dedyn.io/items/models?fields=*.*`,
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
//console.log('resulted article', result.data)
//console.log('gallll', articleImages.value.map(elem=>elem.directus_files_id))

}


const fetchCategories = async () => {

try {
    const response = await fetch(

        'https://latin.dedyn.io/items/categories?fields=*.*' 
        ,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
    if (!response.ok) throw new Error('Failed to fetch info data');
    const result = await response.json();
    //categories.value = result.data

    console.log('resulted categories', result.data)

} catch (error) {
    console.error('error', error)
    console.error('Error fetching categories:');
}

}

onMounted(async () => {

//await fetchCategories()
await fetchModel()
})



</script>

