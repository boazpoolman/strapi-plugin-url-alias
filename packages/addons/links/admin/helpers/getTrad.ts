import pluginId from './pluginId';

/**
 * A helper function to obtain a translation id.
 *
 * @return {string} The plugin id.
 */
const getTrad = (id: string): string => `${pluginId}.${id}`;

export default getTrad;
