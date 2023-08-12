import { type PluginOptions, type ValidatedPluginOptions } from './interfaces'
import { type Configuration, type Entry } from 'webpack'

export function validatePluginOptions (pluginOptions: Partial<PluginOptions>): ValidatedPluginOptions {
  const pluginEntry = isWebpackEntryObject(pluginOptions.entry)
  if (pluginEntry === false) {
    throw new Error([
      'gatsby-plugin-webpack-entry: Option "entry" must use Webpack\'s object syntax.',
      'https://github.com/itmayziii/gatsby-plugin-webpack-entry#available-options.',
      'https://webpack.js.org/concepts/entry-points/#object-syntax.'
    ].join(' '))
  }

  if (Object.keys(pluginEntry).length === 0) {
    throw new Error([
      'gatsby-plugin-webpack-entry: Option "entry" must be a non empty object otherwise this plugin provides no value',
      'and should be removed. https://github.com/itmayziii/gatsby-plugin-webpack-entry#available-options.',
      'https://webpack.js.org/concepts/entry-points/#object-syntax.'
    ].join(' '))
  }

  return {
    ...pluginOptions,
    entry: pluginEntry
  }
}

export function isWebpackEntryObject (webpackEntry: Configuration['entry']): Entry | false {
  if (webpackEntry == null ||
    typeof webpackEntry === 'string' ||
    typeof webpackEntry === 'function' ||
    Array.isArray(webpackEntry)) return false

  return webpackEntry
}

export function overlappingKeys (object1: object, object2: object): string[] {
  return Object.keys(object1).reduce<string[]>((overlapping, key) => {
    if (Object.hasOwn(object2, key) === true) {
      overlapping = [...overlapping, key]
    }

    return overlapping
  }, [])
}
