export const slugify = (text: string) => {

  try {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

  } catch (error) {
    throw error
    return text || ''
  }

};