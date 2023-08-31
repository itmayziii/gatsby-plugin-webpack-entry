import { type GatsbySSR } from 'gatsby'
import React from 'react'
import { type StatsCompilation } from 'webpack'
import { validatePluginOptions } from './utilities'
import { type GatsbyAssets, type ValidatedPluginOptions } from './interfaces'

const onRenderBody: GatsbySSR['onRenderBody'] = function onRenderBody ({
  setHeadComponents,
  setPostBodyComponents
}, pluginOptions) {
  const validatedPluginOptions = validatePluginOptions(pluginOptions)
  const assets = process.env.NODE_ENV === 'production'
    ? getProductionAssets(validatedPluginOptions)
    : getDevelopmentAssets(validatedPluginOptions)
  setHeadComponents(assets.links)
  setPostBodyComponents(assets.scripts)
}

export { onRenderBody }

function getDevelopmentAssets (pluginOptions: ValidatedPluginOptions): GatsbyAssets {
  return Object.keys(pluginOptions.entry).reduce<GatsbyAssets>((assets, entryName) => {
    assets.links = [...assets.links, <link key={entryName} as='script' rel='preload' href={`/${entryName}.js`} />]
    assets.scripts = [...assets.scripts, <script key={entryName} src={`/${entryName}.js`} async={true} />]

    return assets
  }, { links: [], scripts: [] })
}

function getProductionAssets (pluginOptions: ValidatedPluginOptions): GatsbyAssets {
  let webpackStatFile: StatsCompilation
  try {
    // Do not try to require a variable here like `const path = './gatsby-stats.json'`. This code seems to be executed
    // in the context of Webpack and the dynamic require just will not work. Also see the remarks in
    // "gatsby-plugin-webpack-entry-stats-plugin" for reasons why we are using require at all.
    webpackStatFile = require('./gatsby-stats.json')
  } catch (error) {
    throw new Error([
      'gatsby-plugin-webpack-entry: Unable to read Webpack stats file.',
      'Please open an issue at https://github.com/itmayziii/gatsby-plugin-webpack-entry/issues/new/choose.',
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
