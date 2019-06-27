import { OnCreateWebpackConfigArgs, PluginOptions } from './interfaces'

export function onCreateWebpackConfig ({ stage, getConfig, actions }: OnCreateWebpackConfigArgs, pluginOptions: PluginOptions) {
  if (!pluginOptions.entry) {
    // TODO add link to entryPoints docs
    throw new Error('gatsby-plugin-webpack-entry: Missing required option "entry".')
  }
  if (typeof pluginOptions.entry !== 'object' || Object.keys(pluginOptions.entry).length === 0) {
    throw new Error('gatsby-plugin-webpack-entry: Option "entry" must be a non empty object.')
  }

  const config = getConfig()
  if (stage === 'build-javascript') {
    config.entry = { ...config.entry, ...pluginOptions.entry }
    actions.replaceWebpackConfig(config)
  }
}
