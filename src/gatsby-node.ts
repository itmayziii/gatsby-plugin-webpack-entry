import { type OnCreateWebpackConfigArgs, type PluginOptions } from './interfaces'
import { validatePluginOptions } from './helpers'

export function onCreateWebpackConfig ({
  stage,
  getConfig,
  actions
}: OnCreateWebpackConfigArgs, pluginOptions: Partial<PluginOptions>): void {
  if (!validatePluginOptions(pluginOptions)) return

  // stage = "build-javascript" when running "gatsby build"
  if (stage === 'build-javascript') {
    const config = getConfig()
    config.entry = { ...config.entry, ...pluginOptions.entry }
    actions.replaceWebpackConfig(config)
  }

  // stage = "develop" when running "gatsby develop"
  if (stage === 'develop') {
    const config = getConfig()

    config.entry = { ...config.entry, ...addHotModuleReplacement(pluginOptions.entry) }
    actions.replaceWebpackConfig(config)
  }
}

function addHotModuleReplacement (entries: PluginOptions['entry']): PluginOptions['entry'] {
  /*
   This is the same script that the Gatsby React code receives during development to enable HMR. This will ensure that
   HMR is enabled for the custom entrypoint added by library consumers.
   https://github.com/webpack-contrib/webpack-hot-middleware
   */
  const hotModuleReplacement = 'webpack-hot-middleware/client.js?path=/__webpack_hmr&reload=true&overlay=false'

  return Object.keys(entries).reduce<PluginOptions['entry']>((newEntries, current) => {
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
