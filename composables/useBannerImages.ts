// composables/useBannerImages.ts
export const useBannerImages = () => {
    // TypeScript interface for better type safety
    interface BannerImage {
        src: string
        alt: string
        title: string
    }

    // Manually list all your banner images
    const bannerImages: BannerImage[] = [
        {
            src: '/assets/images/banner/chato.png',
            alt: 'Main Banner',
            title: 'Latin Fans'
        },
        {
            src: '/assets/images/banner/hero-banner.jpg',
            alt: 'Secondary Banner',
            title: 'Latin Fans'
        }
        // Add more images as needed
    ]

    return bannerImages
}