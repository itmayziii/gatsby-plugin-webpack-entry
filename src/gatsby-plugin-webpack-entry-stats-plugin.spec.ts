import { beforeEach, jest, test, expect, describe } from '@jest/globals'
import GatsbyPluginWebpackEntryStatsPlugin from './gatsby-plugin-webpack-entry-stats-plugin'
import { type Compiler } from 'webpack'
import fsModuleMock from 'fs'

jest.mock('fs')
const writeFileMock: jest.Mock = fsModuleMock.writeFile as unknown as jest.Mock

const webpackStats = {
  assetsByChunkName: {
    app: [
      'app-4fc130a3882063720bc9.js',
      'app-4fc130a3882063720bc9.js.map'
    ],
    'component---src-pages-404-js': [
      'component---src-pages-404-js-5f2177bc8bd8a86a7f44.js',
      'component---src-pages-404-js-5f2177bc8bd8a86a7f44.js.map'
    ],
    'super-app-v2': [
      'super-app-v2-650064ee3eb65f7aa080.js',
      'super-app-v2-650064ee3eb65f7aa080.js.map'
    ]
  }
}

describe('class GatsbyPluginWebpackEntryStatsPlugin', () => {
  describe('apply()', () => {
    // Lots of uses of "any" in this code, figuring out the exact webpack types is just not worth the time in tests
    let tapAsyncMock: jest.Mock<any>
    let doneCallbackMock: jest.Mock<any>
    let webpackCompiler: Compiler

    beforeEach(() => {
      const stats = {
        toJson () {
          return webpackStats
        }
      }
      tapAsyncMock = jest.fn((name: string, cb: any) => cb(stats, doneCallbackMock))
      doneCallbackMock = jest.fn()
      webpackCompiler = {
        hooks: {
          // @ts-expect-error intentionally only supplying properties necessary for testing
          done: {
            tapAsync: tapAsyncMock
          }
        }
      }
    })

    test('a "gatsby-stats.json" file should be written in the root of this project containing Webpack stats', () => {
      (new GatsbyPluginWebpackEntryStatsPlugin()).apply(webpackCompiler)
      expect(fsModuleMock.writeFile).toHaveBeenCalledTimes(1)
      expect(writeFileMock.mock.calls[0][0]).toMatch(/^(.*)\/gatsby-stats.json$/)
      expect(writeFileMock.mock.calls[0][1]).toEqual(JSON.stringify(webpackStats))
      expect(writeFileMock.mock.calls[0][2]).toEqual('utf8')
      expect(writeFileMock.mock.calls[0][3]).toEqual(doneCallbackMock)
    })
  })
})
