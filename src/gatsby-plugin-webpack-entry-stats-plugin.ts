import fs from 'fs'
import path from 'path'
import { type Compiler } from 'webpack'

export default class GatsbyPluginWebpackEntryStatsPlugin {
  apply (compiler: Compiler): void {
    compiler.hooks.done.tapAsync('GatsbyPluginWebpackEntryStatsPlugin', (stats, done) => {
      const statsCompilation = stats.toJson()
      const filteredStats = { assetsByChunkName: statsCompilation.assetsByChunkName }
      const gatsbyStatsPath = path.resolve(__dirname, 'gatsby-stats.json')
      fs.writeFile(gatsbyStatsPath, JSON.stringify(filteredStats), 'utf8', done)
    })
  }
}
