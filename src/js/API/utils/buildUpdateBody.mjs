export function buildUpdateBody(item) {
  return JSON.stringify({
    ...(item.title && { title: item.title }),
    ...(item.description && { description: item.description }),
    ...(item.tags && { tags: item.tags }),
    ...(item.media && { media: item.media }),
  });
}
