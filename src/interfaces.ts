import { type ReactNode } from 'react'
import { type Configuration, type EntryObject } from 'webpack'

export interface OnCreateWebpackConfigArgs {
  stage: string
  getConfig: () => Configuration
  actions: {
    replaceWebpackConfig: (config: Configuration) => void
  }
}

export interface OnRenderBodyArgs {
  setHeadComponents: (reactNodes: ReactNode[]) => void
  setPostBodyComponents: (reactNodes: ReactNode[]) => void
}

export interface PluginOptions {
  entry: Configuration['entry']
  webpackStatsFilePath?: string
}

export interface ValidatedPluginOptions extends PluginOptions {
  entry: EntryObject
}

export interface GatsbyAssets {
  links: ReactNode[]
  scripts: ReactNode[]
}
