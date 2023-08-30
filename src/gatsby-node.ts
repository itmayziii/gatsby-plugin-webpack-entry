import { type ValidatedPluginOptions } from './interfaces'
import { isWebpackEntryObject, overlappingKeys, validatePluginOptions } from './utilities'
import { type EntryObject } from 'webpack'
import GatsbyPluginWebpackEntryStatsPlugin from './gatsby-plugin-webpack-entry-stats-plugin'
import { type GatsbyNode } from 'gatsby'

const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = async function onCreateWebpackConfig ({
  stage,
  getConfig,
  actions
}, pluginOptions) {
  // stage = "build-javascript" during "gatsby build", stage = "develop" during "gatsby develop"
  if (stage === 'build-javascript' || stage === 'develop') {
    const validPluginOptions = validatePluginOptions(pluginOptions)
    const gatsbyWebpackConfig = getConfig()

    if (!isWebpackEntryObject(gatsbyWebpackConfig.entry)) {
      throw new Error([
        'gatsby-plugin-webpack-entry: Gatsby\'s Webpack configuration is not what this plugin is expecting.',
        'It is possible you are using a version of Gatsby that does not work with this plugin or',
        'another plugin is modifying the Webpack configuration in a way that is not compatible with this plugin.',
        'Please open an issue at https://github.com/itmayziii/gatsby-plugin-webpack-entry/issues/new/choose.'
      ].join(' '))
    }

    const overlappingPluginKeys = overlappingKeys(gatsbyWebpackConfig.entry, validPluginOptions.entry)
    if (overlappingPluginKeys.length > 0) {
      throw new Error([
        'gatsby-plugin-webpack-entry: Provided plugin "entry" option has keys that would overlap with Gatsby.',
        'You should avoid overlapping keys as it will override the JavaScript Gatsby is attempting to compile with',
        `Webpack. Overlapping keys: ${overlappingPluginKeys.join(', ')}`
      ].join(' '))
    }

    const pluginEntry = stage === 'develop'
      ? addHotModuleReplacement(validPluginOptions.entry)
      : validPluginOptions.entry

    // Not likely but a valid webpack config says plugins could be undefined
    const gatsbyWebpackPlugins = gatsbyWebpackConfig.plugins ?? []
    actions.replaceWebpackConfig({
      ...gatsbyWebpackConfig,
      entry: { ...gatsbyWebpackConfig.entry, ...pluginEntry },
      plugins: [...gatsbyWebpackPlugins, new GatsbyPluginWebpackEntryStatsPlugin()]
    })
  }
}

export default { onCreateWebpackConfig }
export { onCreateWebpackConfig }

/**
 * Adds a hot module replacement script to the
 * {@link https://webpack.js.org/concepts/entry-points/#object-syntax | Webpack entry object} to allow for
 * {@link https://github.com/webpack-contrib/webpack-hot-middleware | hot reloading in development mode}.
 * @param entries - {@link https://webpack.js.org/concepts/entry-points/#object-syntax | Webpack entry object}
 */
function addHotModuleReplacement (entries: ValidatedPluginOptions['entry']): EntryObject {
  /*
   This is the same script that the Gatsby React code receives during development to enable HMR. This will ensure that
   HMR is enabled for the custom entrypoint added by library consumers.
   https://github.com/webpack-contrib/webpack-hot-middleware
   */
  const hotModuleReplacement = 'webpack-hot-middleware/client.js?path=/__webpack_hmr&reload=true&overlay=false'
  return Object.keys(entries).reduce<EntryObject>((newEntries, current) => {
    const entryValue = entries[current]

    /*
     {
       entry: {
         main: './src/hello.js'
       }
     }
     */
    if (typeof entryValue === 'string') {
      newEntries[current] = [hotModuleReplacement, entryValue]
      return newEntries
    }

    /*
     {
       entry: {
         main: ['./src/hello.js', './src/hello-2.js']
       }
     }
     */
    if (Array.isArray(entryValue)) {
      newEntries[current] = [hotModuleReplacement, ...entryValue]
      return newEntries
    }

    /*
     Fallthrough to handle cases where somebody might not be using a string or an array of strings for their webpack
     entry value. We are not currently going to handle these more complex cases for hot module reloading.
     https://webpack.js.org/concepts/entry-points/#entrydescription-object
     {
       entry: {
         a2: './a',
         b2: {
           runtime: 'x2',
           dependOn: 'a2',
           import: './b'
         }
       }
     }
     */
    newEntries[current] = entryValue

    return newEntries
  }, {})
}
