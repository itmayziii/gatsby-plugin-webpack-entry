import { OnCreateWebpackConfigArgs, PluginOptions } from './interfaces'

export function onCreateWebpackConfig ({ stage, getConfig, actions }: OnCreateWebpackConfigArgs, pluginOptions: PluginOptions) {
  if (!pluginOptions.entry) {
    throw new Error('gatsby-plugin-webpack-entry: Missing required option "entry". https://github.com/itmayziii/gatsby-plugin-webpack-entry#available-options')
  }
  if (typeof pluginOptions.entry !== 'object' || Object.keys(pluginOptions.entry).length === 0) {
    throw new Error('gatsby-plugin-webpack-entry: Option "entry" must be a non empty object. https://github.com/itmayziii/gatsby-plugin-webpack-entry#available-options')
  }

  if (stage === 'build-javascript') {
    const config = getConfig()
    config.entry = { ...config.entry, ...pluginOptions.entry }
    actions.replaceWebpackConfig(config)
  }
}
