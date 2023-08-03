import * as fs from 'fs'
import * as path from 'path'
import { type OnRenderBodyArgs, type PluginOptions, type WebpackAssets, type WebpackStatFile } from './interfaces'
import { validatePluginOptions } from './helpers'
import React from 'react'

export function onRenderBody ({
  setHeadComponents,
  setPostBodyComponents
}: OnRenderBodyArgs, pluginOptions: PluginOptions): void {
  if (!validatePluginOptions(pluginOptions)) return

  const assets = process.env.NODE_ENV === 'production'
    ? getProductionAssets(pluginOptions)
    : getDevelopmentAssets(pluginOptions)

  setHeadComponents(assets.links)
  setPostBodyComponents(assets.scripts)
}

function getDevelopmentAssets (pluginOptions: PluginOptions): WebpackAssets {
  return Object.keys(pluginOptions.entry).reduce<WebpackAssets>((assets, entryName) => {
    assets.links = [...assets.links, <link key={entryName} as='script' rel='preload' href={`/${entryName}.js`} />]
    assets.scripts = [...assets.scripts, <script key={entryName} src={`/${entryName}.js`} async={true} />]

    return assets
  }, { links: [], scripts: [] })
}

function getProductionAssets (pluginOptions: PluginOptions): WebpackAssets {
  const webpackStatsFilePath = pluginOptions.webpackStatsFilePath ?? path.resolve('public', 'webpack.stats.json')
  let webpackStatFile: WebpackStatFile
  try {
    webpackStatFile = JSON.parse(fs.readFileSync(webpackStatsFilePath, 'utf8'))
  } catch (error) {
    throw new Error(`gatsby-plugin-webpack-entry: Unable to read Webpack stats file at path ${webpackStatsFilePath}.`)
  }

  return Object.keys(pluginOptions.entry).reduce<WebpackAssets>((assets, entryName) => {
    const chunkAssets = webpackStatFile.assetsByChunkName[entryName]
    if (chunkAssets === undefined) return assets

    chunkAssets.forEach(chunkAsset => {
      // We should not add map files and Webpack runtime is already added by Gatsby.
      if (chunkAsset.endsWith('.map') || chunkAsset.includes('webpack-runtime')) return

      assets.links = [...assets.links, <link key={`${entryName}=${chunkAsset}`} as='script' rel='preload' href={chunkAsset} />]
      assets.scripts = [...assets.scripts, <script key={`${entryName}=${chunkAsset}`} src={chunkAsset} async={true} />]
    })

    return assets
  }, { links: [], scripts: [] })
}
