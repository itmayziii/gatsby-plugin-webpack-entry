import { OnCreateWebpackConfigArgs, PluginOptions } from './interfaces'
import { validatePluginOptions } from './helpers'

export function onCreateWebpackConfig ({ stage, getConfig, actions }: OnCreateWebpackConfigArgs, pluginOptions: Partial<PluginOptions>) {
  validatePluginOptions(pluginOptions)

  if (stage === 'build-javascript') {
    const config = getConfig()
    config.entry = { ...config.entry, ...pluginOptions.entry }
    actions.replaceWebpackConfig(config)
  }
}
