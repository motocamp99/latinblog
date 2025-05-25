<template>
    <div>

        <div
            style="display: flex; flex-direction: row; justify-content: center; align-items:center; padding: 30px;">
            <Navigation />
        </div>

        <Toaster />

        <div class="slot-wrapper">

            <slot class="main-content" />
        </div>

        <section>
            <Footer />
        </section>

    </div>
</template>

<script setup>

import Toaster from '@/components/ui/toast/Toaster.vue'

</script>
