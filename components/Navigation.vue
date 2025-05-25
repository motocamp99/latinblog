<script setup lang="ts">
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { ref } from 'vue'

const components: { title: string, href: string, description: string }[] = [
    {
        title: 'Alert Dialog',
        href: '/docs/components/alert-dialog',
        description:
            'A modal dialog that interrupts the user with important content and expects a response.',
    },
    // ... keep your other components array items ...
]

const isMobileMenuOpen = ref(false)
</script>

<template>
    <header
        class="fixed top-0 z-50 w-full backdrop-blur-md bg-background/80 supports-[backdrop-filter]:bg-background/60 border-b"
        id="header-nav">
        <div class="w-full flex h-20 items-center justify-between px-4 md:px-16">
            <!-- Logo -->
            <NuxtLink to="/" class="flex items-center" style="margin-left: 0; margin-right: 2vw;">
                <img src="/logo.png" alt="Logo" class="h-8 w-auto" style="width: 100px; height: auto;" />
            </NuxtLink>

            <!-- Desktop Navigation (shown on md screens and up) -->
            <NavigationMenu id="desktop-menu" >
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger style="background: transparent;">Modelos</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul
                                class="grid gap-3 p-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]">
                                <li class="row-span-3">
                                    <NavigationMenuLink as-child>
                                        <a class="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                            href="/">
                                            <img src="/logo.png" class="h-6 w-6">
                                            <div class="mb-2 mt-4 text-lg font-medium">
                                                Todas las modelos
                                            </div>
                                            <p class="text-sm leading-tight text-muted-foreground">
                                                Beautifully designed components built with Radix UI and
                                                Tailwind CSS.
                                            </p>
                                        </a>
                                    </NavigationMenuLink>
                                </li>
                                <li>
                                    <NavigationMenuLink as-child>
                                        <a href="/docs/introduction"
                                            class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                            <div class="text-sm font-medium leading-none">Estrellas Porno Latinas</div>
                                            <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                Re-usable components built using Radix UI and Tailwind CSS.
                                            </p>
                                        </a>
                                    </NavigationMenuLink>
                                </li>
                                <li>
                                    <NavigationMenuLink as-child>
                                        <a href="/docs/installation"
                                            class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                            <div class="text-sm font-medium leading-none">Latinas Webcams</div>
                                            <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                How to install dependencies and structure your app.
                                            </p>
                                        </a>
                                    </NavigationMenuLink>
                                </li>
                                <li>
                                    <NavigationMenuLink as-child>
                                        <a href="/docs/typography"
                                            class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                            <div class="text-sm font-medium leading-none">Latinas Onlyfans</div>
                                            <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                Styles for headings, paragraphs, lists...etc
                                            </p>
                                        </a>
                                    </NavigationMenuLink>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger style="background: transparent;">Categorías</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[500px]">
                                <li v-for="component in components" :key="component.title">
                                    <NavigationMenuLink as-child>
                                        <a :href="component.href"
                                            class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                            <div class="text-sm font-medium leading-none">{{ component.title }}
                                            </div>
                                            <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                {{ component.description }}
                                            </p>
                                        </a>
                                    </NavigationMenuLink>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem style="background: transparent;">
                        <NavigationMenuLink style="background: transparent;" href="/docs/introduction"
                            :class="navigationMenuTriggerStyle()">
                            Base de Datos
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem style="background: transparent;">
                        <NavigationMenuLink style="background: transparent;" href="/docs/introduction"
                            :class="navigationMenuTriggerStyle()">
                            Contacto
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem style="background: transparent;">
                        <NavigationMenuLink style="background: transparent;" href="/docs/introduction"
                            :class="navigationMenuTriggerStyle()">
                            Panties
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                </NavigationMenuList>
            </NavigationMenu>

            <!-- Mobile Menu Button (hidden on md screens and up) -->
            <button @click="isMobileMenuOpen = !isMobileMenuOpen" style="display: none;" id="mobile-buttons">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
        </div>

        <!-- Mobile Navigation Menu (hidden on md screens and up) -->
        <div v-if="isMobileMenuOpen" class="bg-background/95 backdrop-blur-md pb-4 px-4" style="display: none;" id="mobile-container">
            <div class="flex flex-col space-y-2">
                <NuxtLink to="/docs/introduction" class="px-4 py-2 hover:bg-accent rounded-md">
                    Documentation
                </NuxtLink>
                <div class="px-4 py-2">
                    <div class="font-medium mb-2">Etiquetas</div>
                    <div class="flex flex-col space-y-2 pl-4">
                        <NuxtLink to="/docs/introduction" class="hover:bg-accent rounded-md px-2 py-1">
                            Introduction
                        </NuxtLink>
                        <NuxtLink to="/docs/installation" class="hover:bg-accent rounded-md px-2 py-1">
                            Installation
                        </NuxtLink>
                        <NuxtLink to="/docs/typography" class="hover:bg-accent rounded-md px-2 py-1">
                            Typography
                        </NuxtLink>
                    </div>
                </div>
                <div class="px-4 py-2">
                    <div class="font-medium mb-2">Etiquetas</div>
                    <div class="flex flex-col space-y-2 pl-4">
                        <NuxtLink v-for="component in components" :key="component.title" :to="component.href"
                            class="hover:bg-accent rounded-md px-2 py-1">
                            {{ component.title }}
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<style>
/* Smooth transition for mobile menu */
#header-nav {
    transition: all 0.3s ease;
}
 
/* Adjust container padding for mobile */
@media (max-width: 768px) {

    #mobile-buttons, #mobile-container{
        display: flex !important;
    }

    #desktop-menu{
        display: none !important;
    }

    .container {
        padding-left: 1rem;
        padding-right: 1rem;
    }
}
</style>