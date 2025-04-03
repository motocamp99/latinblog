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

const components: { title: string, href: string, description: string }[] = [
    {
        title: 'Alert Dialog',
        href: '/docs/components/alert-dialog',
        description:
            'A modal dialog that interrupts the user with important content and expects a response.',
    },
    {
        title: 'Hover Card',
        href: '/docs/components/hover-card',
        description:
            'For sighted users to preview content available behind a link.',
    },
    {
        title: 'Progress',
        href: '/docs/components/progress',
        description:
            'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
    },
    {
        title: 'Scroll-area',
        href: '/docs/components/scroll-area',
        description: 'Visually or semantically separates content.',
    },
    {
        title: 'Tabs',
        href: '/docs/components/tabs',
        description:
            'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
    },
    {
        title: 'Tooltip',
        href: '/docs/components/tooltip',
        description:
            'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
    },
]
</script>

<template>
    <header
        class="fixed top-0 z-50 w-full backdrop-blur-md bg-background/80 supports-[backdrop-filter]:bg-background/60 border-b "
        id="header-nav">
        <div class="w-full flex h-20 justify-between px-4 px-16" >
            <!-- Logo on the left -->
            <NuxtLink to="/" class="flex items-center" style="margin-left: 5vw;">
                <img src="/logo.png" alt="Logo" class="h-8 w-auto" style="width: 100px; height: auto;" />
            </NuxtLink>

            <!-- Navigation menu on the right -->
            <!--<div class="w-full" >-->
                <NavigationMenu class="" style="margin-right: 10vw;">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger style="background: transparent;">Getting started</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul
                                    class="grid gap-3 p-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]">
                                    <li class="row-span-3">
                                        <NavigationMenuLink as-child>
                                            <a class="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                href="/">
                                                <img src="/logo.png" class="h-6 w-6">
                                                <div class="mb-2 mt-4 text-lg font-medium">
                                                    shadcn/ui
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
                                                <div class="text-sm font-medium leading-none">Introduction</div>
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
                                                <div class="text-sm font-medium leading-none">Installation</div>
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
                                                <div class="text-sm font-medium leading-none">Typography</div>
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
                            <NavigationMenuTrigger style="background: transparent;">Components</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
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
                            <NavigationMenuLink style="background: transparent;" href="/docs/introduction" :class="navigationMenuTriggerStyle()">
                                Documentation
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>


            <!--</div>-->

        </div>
    </header>
</template>

<style>
#header-nav {
    /*
    position: fixed !important;
    top: 0px !important;
    */
    
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .container {
        padding: 0 1rem;
    }

    /* You might want to add a hamburger menu for mobile */
    /* This would require additional JavaScript implementation */
}
</style>