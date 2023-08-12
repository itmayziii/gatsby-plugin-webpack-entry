import { type ReactNode } from 'react'
import { type Configuration, type Entry } from 'webpack'

export interface OnCreateWebpackConfigArgs {
  stage: string
  getConfig: () => Configuration
  actions: {
    replaceWebpackConfig: (config: unknown) => void
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
  entry: Entry
}

export interface GatsbyAssets {
  links: ReactNode[]
  scripts: ReactNode[]
}
