import { PluginOptions } from './interfaces'

export function validatePluginOptions (pluginOptions: Partial<PluginOptions>): pluginOptions is PluginOptions {
  if (!pluginOptions.entry) {
    throw new Error('gatsby-plugin-webpack-entry: Missing required option "entry". https://github.com/itmayziii/gatsby-plugin-webpack-entry#available-options')
  }
  // tslint:disable-next-line strict-type-predicates
  if (typeof pluginOptions.entry !== 'object' || Object.keys(pluginOptions.entry).length === 0) {
    throw new Error('gatsby-plugin-webpack-entry: Option "entry" must be a non empty object. https://github.com/itmayziii/gatsby-plugin-webpack-entry#available-options')
  }

  return true
}
