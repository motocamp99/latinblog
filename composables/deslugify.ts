export const deslugify = (slug: string) => {
    return slug
      .split('-') // Split by dashes
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(' '); // Join with spaces
  };