import * as fs from 'fs'
import * as path from 'path'
import { type OnRenderBodyArgs, type PluginOptions, type GatsbyAssets, type ValidatedPluginOptions } from './interfaces'
import { validatePluginOptions } from './helpers'
import React from 'react'
import { type StatsCompilation } from 'webpack'

export function onRenderBody ({
  setHeadComponents,
  setPostBodyComponents
}: OnRenderBodyArgs, pluginOptions: PluginOptions): void {
  const validatedPluginOptions = validatePluginOptions(pluginOptions)
  const assets = process.env.NODE_ENV === 'production'
    ? getProductionAssets(validatedPluginOptions)
    : getDevelopmentAssets(validatedPluginOptions)

  setHeadComponents(assets.links)
  setPostBodyComponents(assets.scripts)
}

function getDevelopmentAssets (pluginOptions: ValidatedPluginOptions): GatsbyAssets {
  return Object.keys(pluginOptions.entry).reduce<GatsbyAssets>((assets, entryName) => {
    assets.links = [...assets.links, <link key={entryName} as='script' rel='preload' href={`/${entryName}.js`} />]
    assets.scripts = [...assets.scripts, <script key={entryName} src={`/${entryName}.js`} async={true} />]

    return assets
  }, { links: [], scripts: [] })
}

function getProductionAssets (pluginOptions: ValidatedPluginOptions): GatsbyAssets {
  const webpackStatsFilePath = pluginOptions.webpackStatsFilePath ?? path.resolve('public', 'webpack.stats.json')
  let webpackStatFile: StatsCompilation
  try {
    webpackStatFile = JSON.parse(fs.readFileSync(webpackStatsFilePath, 'utf8'))
  } catch (error) {
    throw new Error([
      `gatsby-plugin-webpack-entry: Unable to read Webpack stats file at path ${webpackStatsFilePath}.`,
      'https://webpack.js.org/api/stats/.'
    ].join(' '))
  }

  return Object.keys(pluginOptions.entry).reduce<GatsbyAssets>((assets, entryName) => {
    if (webpackStatFile.assetsByChunkName === undefined) {
      throw new Error([
        'gatsby-plugin-webpack-entry: Gatsby\'s Webpack stats file is missing the "assetsByChunkName" property.',
        'It is possible you are using a version of Gatsby that does not work with this plugin or',
        'another plugin is modifying the Webpack stats file in a way that is not compatible with this plugin.',
        'Please open an issue at https://github.com/itmayziii/gatsby-plugin-webpack-entry/issues/new/choose.',
        'https://webpack.js.org/api/stats/.'
      ].join(' '))
    }
    const chunkAssets = webpackStatFile.assetsByChunkName[entryName]
    if (chunkAssets === undefined) {
      throw new Error([
        `gatsby-plugin-webpack-entry: Gatsby's Webpack stats file is missing the "assetsByChunkName["${entryName}"]"`,
        'property. It is possible you are using a version of Gatsby that does not work with this plugin or',
        'another plugin is modifying the Webpack stats file in a way that is not compatible with this plugin.',
        'Please open an issue at https://github.com/itmayziii/gatsby-plugin-webpack-entry/issues/new/choose.',
        'https://webpack.js.org/api/stats/.'
      ].join(' '))
    }

    chunkAssets.forEach(chunkAsset => {
      // We should not include the Webpack runtime as this is already included by Gatsby.
      if (chunkAsset.includes('webpack-runtime')) return

      assets.links = [
        ...assets.links,
        <link key={`${entryName}=${chunkAsset}`} as='script' rel='preload' href={chunkAsset} />
      ]
      assets.scripts = [
        ...assets.scripts,
        <script key={`${entryName}=${chunkAsset}`} src={chunkAsset} async={true} />
      ]
    })

    return assets
  }, { links: [], scripts: [] })
}
