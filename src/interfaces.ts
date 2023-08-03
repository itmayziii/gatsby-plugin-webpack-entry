import { type ReactNode } from 'react'

export interface OnCreateWebpackConfigArgs {
  stage: string
  getConfig: () => any
  actions: {
    replaceWebpackConfig: (config: any) => void
  }
}

export interface WebpackStatFile {
  errors: any[]
  warnings: any[]
  namedChunkGroups: Record<string, {
    chunks: number[]
    assets: string[]
    children: Record<string, any>
    childAssets: Record<string, any>
  }>
  assetsByChunkName: Record<string, string[]>
}

export interface OnRenderBodyArgs {
  setHeadComponents: (reactNodes: ReactNode[]) => void
  setPostBodyComponents: (reactNodes: ReactNode[]) => void
}

export interface PluginOptions {
  entry: Record<string, string | string[]>
  webpackStatsFilePath?: string
}

export interface WebpackAssets {
  links: ReactNode[]
  scripts: ReactNode[]
}
