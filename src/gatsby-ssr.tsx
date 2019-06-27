import * as fs from 'fs'
import * as path from 'path'
import * as React from 'react'
import { OnRenderBodyArgs, PluginOptions, WebpackStatFile } from './interfaces'

let webpackStatFile: WebpackStatFile
export function onRenderBody ({ setHeadComponents, setPostBodyComponents }: OnRenderBodyArgs, pluginOptions: PluginOptions) {
  if (!webpackStatFile) {
    try {
      webpackStatFile = JSON.parse(fs.readFileSync(path.resolve('public', 'webpack.stats.json'), 'utf8'))
    } catch (error) {
      throw new Error('gatsby-plugin-webpack-entry: Gatsby removed an internal detail that this plugin relied upon, please submit this issue to https://www.github.com/itmayziii/gatsby-plugin-webpack-entry.')
    }
  }

  let entryLinks: React.ReactNode[] = []
  let entryScripts: React.ReactNode[] = []
  Object.keys(pluginOptions.entry).forEach((entry) => {
    webpackStatFile.namedChunkGroups[entry].assets.forEach((asset) => {
      // We should not add map files and Webpack runtime is already added by Gatsby.
      if (asset.endsWith('.map') || /webpack-runtime/.test(asset)) return

      entryLinks.push(<link key={asset} as='script' rel='preload' href={`/${asset}`}/>)
      entryScripts.push(<script key={asset} src={`/${asset}`} async={true}/>)
    }, [])
  })

  setHeadComponents(entryLinks)
  setPostBodyComponents(entryScripts)
}
