import { type ReactNode } from 'react'
import { type EntryObject } from 'webpack'

/**
 * Plugin options supplied by the plugin consumer but have been validated to match what we expect
 */
export interface ValidatedPluginOptions {
  /**
   * Webpack's entry point property using the
   * {@link https://webpack.js.org/concepts/entry-points/#object-syntax | object syntax}.
   */
  entry: EntryObject
  /**
   * Path to the {@link https://webpack.js.org/api/stats/ | Webpack stats} file path. A plugin consumer should never
   * supply this value as it exists only for testing purposes.
   * @internal
   */
  webpackStatsFilePath?: string
}

/**
 * Lists of assets added to Gatsby.
 */
export interface GatsbyAssets {
  links: ReactNode[]
  scripts: ReactNode[]
}
