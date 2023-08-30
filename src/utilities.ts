import { type ValidatedPluginOptions } from './interfaces'
import { type PluginOptions } from 'gatsby'
import { type EntryObject } from 'webpack'

/**
 * Validates that the plugin option parameters passed in from the plugin consumer matches what we are expecting.
 * @param pluginOptions - plugin consumer provided options to this plugin.
 * @throws Error If "pluginOptions.entry" is not a
 * {@link https://webpack.js.org/concepts/entry-points/#object-syntax | webpack entry object}
 * @throws Error If "pluginOptions.entry" is an empty object.
 * @returns The originally passed in "pluginOptions" but typed as ValidatedPluginOptions, so we can use them in a type
 * safe manner.
 */
export function validatePluginOptions (pluginOptions: PluginOptions): ValidatedPluginOptions {
  if (!isWebpackEntryObject(pluginOptions.entry)) {
    throw new Error([
      'gatsby-plugin-webpack-entry: Option "entry" must use Webpack\'s object syntax.',
      'https://github.com/itmayziii/gatsby-plugin-webpack-entry#available-options.',
      'https://webpack.js.org/concepts/entry-points/#object-syntax.'
    ].join(' '))
  }

  if (Object.keys(pluginOptions.entry).length === 0) {
    throw new Error([
      'gatsby-plugin-webpack-entry: Option "entry" must be a non empty object otherwise this plugin provides no value',
      'and should be removed. https://github.com/itmayziii/gatsby-plugin-webpack-entry#available-options.',
      'https://webpack.js.org/concepts/entry-points/#object-syntax.'
    ].join(' '))
  }

  return {
    ...pluginOptions,
    entry: pluginOptions.entry
  }
}

/**
 * Checks if something is a {@link https://webpack.js.org/concepts/entry-points/#object-syntax | Webpack entry object}.
 * This makes use of
 * {@link https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates | TypeScript type guards}
 * so it may not be a perfect type check and is an area of the code susceptible to bugs.
 * @param webpackEntry - Potentially anything but hopefully is a
 * {@link https://webpack.js.org/concepts/entry-points/#object-syntax | Webpack entry object}.
 * @returns The passed in "webpackEntry" but now typed as a EntryObject.
 */
export function isWebpackEntryObject (webpackEntry: unknown): webpackEntry is EntryObject {
  if (webpackEntry == null ||
    typeof webpackEntry === 'string' ||
    typeof webpackEntry === 'function' ||
    typeof webpackEntry !== 'object' ||
    Array.isArray(webpackEntry)) return false

  return true
}

/**
 * Given 2 objects, determines the shared keys regardless of the value of the key.
 * @param object1 - The first object
 * @param object2 - The second object
 * @returns The keys shared between "object1" and "object2"
 */
export function overlappingKeys (object1: Record<string, unknown>, object2: Record<string, unknown>): string[] {
  return Object.keys(object1).reduce<string[]>((overlapping, key) => {
    if (Object.hasOwn(object2, key)) {
      overlapping = [...overlapping, key]
    }

    return overlapping
  }, [])
}
