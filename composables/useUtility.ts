/**
 * Helper function to return the module or Vue component name
 */
export default (importMeta: ImportMetaObject) => {
  // console.log('[useUtility.js] importMeta.url', importMeta.url);
  // Examples: http://localhost:3000/_nuxt/utils/cache.js?t=1692068785748, http://localhost:3000/_nuxt/components/AppHeader/index.vue?t=1692068785748

  // Extract file path ending with `.js`, `.ts`, or `.vue`
  const importMetaUrlMatch = importMeta.url.match(/(.)+\.(js|ts|vue)/i);
  const currentFilePathAndName = importMetaUrlMatch?.length ? importMetaUrlMatch[0] : '';
  // console.log('[useUtility.js] currentFilePathAndName', currentFilePathAndName);
  // Examples: http://localhost:3000/_nuxt/utils/cache.js, http://localhost:3000/_nuxt/components/AppHeader/index.vue

  const urlSegments = currentFilePathAndName.split('/');
  // console.log('[useUtility.js] urlSegments, urlSegments.slice(-2)', urlSegments, urlSegments.slice(-2));
  // Example: [ "http:", "", "localhost:3000", "_nuxt", "utils", "cache.js" ], [ "utils", "cache.js" ]

  // Add folder name to file name if file name starts with 'index'
  const doesFileNameStartWithIndex = urlSegments.slice(-1)[0].split('.')[0] === 'index';
  const currentFileName = urlSegments.slice(doesFileNameStartWithIndex ? -2 : -1).join('/');
  // console.log('[useUtility.js] currentFileName', currentFileName);

  // Remove string after - to prevent cache key changing after every update
  const currentFileNameMatch = currentFileName.match(/[^-.]+/i);
  const cacheKeyPrefix = currentFileNameMatch?.length ? currentFileNameMatch[0] : '';

  return {
    cacheKeyPrefix,
    currentFileName,
  };
};
