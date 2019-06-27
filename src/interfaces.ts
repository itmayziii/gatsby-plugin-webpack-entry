import { ReactNode } from 'react'

export interface OnCreateWebpackConfigArgs {
  stage: string
  getConfig (): any
  actions: {
    replaceWebpackConfig (config: any): void
  }
}

export interface WebpackStatFile {
  errors: any[],
  warnings: any[],
  namedChunkGroups: {
    [key: string]: {
      chunks: number[],
      assets: string[],
      children: { [key: string]: any }
      childAssets: { [key: string]: any }
    }
  }
}

export interface OnRenderBodyArgs {
  setHeadComponents (reactNodes: ReactNode[]): void
  setPostBodyComponents (reactNodes: ReactNode[]): void
}

export interface PluginOptions {
  entry: { [key: string]: string }
}
