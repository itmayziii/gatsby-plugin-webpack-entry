import fs from 'fs'
import path from 'path'
import { type Compiler } from 'webpack'

/**
 * Writes this plugin's own custom {@link https://webpack.js.org/api/stats/ | Webpack stats file.} The ONLY reason
 * this plugin exists is that reading the Gatsby generated Webpack stats located at
 * <gatsby-dir>/public/webpack.stats.json was not working except in ways that result in breaking incremental builds.
 *
 * @privateRemarks
 * Multiple attempts were made to read the <gatsby-dir>/public/webpack.stats.json file including:
 *
 * 1. Reading the file with the "fs" module. This approach worked but disables Gatsby incremental builds due to
 * {@link https://www.gatsbyjs.com/docs/debugging-incremental-builds/#avoid-direct-filesystem-calls | this issue}. The
 * alternative listed in that Gatsby documentation points for people to use Webpack's raw-loader as they are assuming
 * people are reading things like CSS files. Obviously raw-loader doesn't solve our use case. I did look into how we
 * could bypass Gatsby's spying on the fs module, but it seems they are using JS Proxies and every attempt I had at
 * bypassing the proxy was unsuccessful. i.e. `const originalFs = Object.assign({}, fs)` still results in the proxy
 * being notified.
 *
 * 2. Using `require` i.e. `const webpackStats = require('<gatsby-dir>/public/webpack.stats.json')`. This approach
 * seems like a nice alternative to the `fs` module but for whatever reason absolute imports would not work when using
 * this plugin in Gatsby, and we would need absolute imports in order for us to work on every machine. I imagine Gatsby
 * is doing something that is making absolute imports not able to resolve correctly. This approach could still work
 * possibly if someone could figure out why the absolute imports don't work in the first place. just for clarification
 * "absolute imports" is referring to
 * `const webpackStats = require('/Users/tmay/dev/projects/gatsby-v2/public/webpack.stats.json')`. It did not matter
 * if I was hard coded an absolute path that I knew existed, it simply would fail with MODULE_NOT_FOUND.
 *
 * The actual solution for now is we write a gatsby-stats.json file the root of this plugin and then use `require`
 * with a relative import path, and it works unlike the absolute import issue mentioned above.
 */
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
