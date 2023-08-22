import { describe, test, expect, beforeEach, beforeAll, afterAll, jest } from '@jest/globals'
import * as path from 'path'
import { onRenderBody } from './gatsby-ssr'
import { type OnRenderBodyArgs } from './interfaces'

describe('gatsby-ssr', () => {
  describe('onRenderBody', () => {
    let setHeadComponentsSpy: jest.Mock<OnRenderBodyArgs['setHeadComponents']>
    let setPostBodyComponentsSpy: jest.Mock<OnRenderBodyArgs['setPostBodyComponents']>
    beforeEach(() => {
      setHeadComponentsSpy = jest.fn().mockName('setHeadComponents')
      setPostBodyComponentsSpy = jest.fn().mockName('setPostBodyComponents')
    })

    describe('process.env.NODE_ENV = "development"', () => {
      let originalNodeEnv: string | undefined
      beforeAll(() => {
        originalNodeEnv = process.env.NODE_ENV
        process.env.NODE_ENV = 'development'
      })
      afterAll(() => {
        process.env.NODE_ENV = originalNodeEnv
      })

      test('should set the head and post body scripts for each entry', () => {
        onRenderBody({
          setHeadComponents: setHeadComponentsSpy,
          setPostBodyComponents: setPostBodyComponentsSpy
        }, {
          entry: { 'super-app': 'super-app.js' },
          webpackStatsFilePath: path.resolve(__dirname, '../test/fixtures/gatsby-ssr/good-stats.json')
        })

        expect(setHeadComponentsSpy).toHaveBeenCalledTimes(1)
        expect(setHeadComponentsSpy.mock.calls[0].length).toEqual(1)
        expect(setPostBodyComponentsSpy).toHaveBeenCalledTimes(1)
        expect(setHeadComponentsSpy.mock.calls[0].length).toEqual(1)
      })
    })

    describe('process.env.NODE_ENV = "production"', () => {
      let originalNodeEnv: string | undefined
      beforeAll(() => {
        originalNodeEnv = process.env.NODE_ENV
        process.env.NODE_ENV = 'production'
      })
      afterAll(() => {
        process.env.NODE_ENV = originalNodeEnv
      })

      test('should throw an error if the webpack stat file can not be read', () => {
        expect(() => {
          onRenderBody({
            setHeadComponents: setHeadComponentsSpy,
            setPostBodyComponents: setPostBodyComponentsSpy
          }, {
            entry: { 'super-app': 'super-app.js' },
            webpackStatsFilePath: path.resolve(__dirname, 'does-not-exist.json')
          })
        })
          // eslint-disable-next-line max-len
          .toThrow(/^gatsby-plugin-webpack-entry: Unable to read Webpack stats file at path (.*)\. https:\/\/webpack.js.org\/api\/stats\/\.$/)
      })

      test('should throw an error if the webpack stat file can not be JSON parsed', () => {
        expect(() => {
          onRenderBody({
            setHeadComponents: setHeadComponentsSpy,
            setPostBodyComponents: setPostBodyComponentsSpy
          }, {
            entry: { 'super-app': 'super-app.js' },
            webpackStatsFilePath: path.resolve(__dirname, '../test/fixtures/gatsby-ssr/malformed-stats.json')
          })
        }
        )
          // eslint-disable-next-line max-len
          .toThrow(/^gatsby-plugin-webpack-entry: Unable to read Webpack stats file at path (.*)\. https:\/\/webpack.js.org\/api\/stats\/\.$/)
      })

      test('should throw an error if "assetsByChunkName" property is missing from webpack stats file', () => {
        const expectedError = new Error([
          'gatsby-plugin-webpack-entry: Gatsby\'s Webpack stats file is missing the "assetsByChunkName" property.',
          'It is possible you are using a version of Gatsby that does not work with this plugin or',
          'another plugin is modifying the Webpack stats file in a way that is not compatible with this plugin.',
          'Please open an issue at https://github.com/itmayziii/gatsby-plugin-webpack-entry/issues/new/choose.',
          'https://webpack.js.org/api/stats/.'
        ].join(' '))
        expect(() => {
          onRenderBody({
            setHeadComponents: setHeadComponentsSpy,
            setPostBodyComponents: setPostBodyComponentsSpy
          }, {
            entry: { 'super-app': 'super-app.js' },
            webpackStatsFilePath: path.resolve(
              __dirname, '../test/fixtures/gatsby-ssr/missing-assets-by-chunk-name-stats.json')
          })
        }
        ).toThrow(expectedError)
      })

      test('should throw an error if webpack stats file "assetsByChunkName" is missing the entry name', () => {
        const expectedError = new Error([
          'gatsby-plugin-webpack-entry: Gatsby\'s Webpack stats file is missing the "assetsByChunkName["super-app"]"',
          'property. It is possible you are using a version of Gatsby that does not work with this plugin or',
          'another plugin is modifying the Webpack stats file in a way that is not compatible with this plugin.',
          'Please open an issue at https://github.com/itmayziii/gatsby-plugin-webpack-entry/issues/new/choose.',
          'https://webpack.js.org/api/stats/.'
        ].join(' '))
        expect(() => {
          onRenderBody({
            setHeadComponents: setHeadComponentsSpy,
            setPostBodyComponents: setPostBodyComponentsSpy
          }, {
            entry: { 'super-app': 'super-app.js' },
            webpackStatsFilePath: path.resolve(
              __dirname, '../test/fixtures/gatsby-ssr/missing-assets-by-chunk-name-entry-stats.json')
          })
        }
        ).toThrow(expectedError)
      })

      test('should use default path to the webpack stats file if the "webpackStatsFilePath" is not provided', () => {
        // Only an error because the default path does not exist in our test data, but would exist in a Gatsby repo
        expect(() => {
          onRenderBody({
            setHeadComponents: setHeadComponentsSpy,
            setPostBodyComponents: setPostBodyComponentsSpy
          }, {
            entry: { 'super-app': 'super-app.js' }
          })
        }
        )
          // eslint-disable-next-line max-len
          .toThrow(/^gatsby-plugin-webpack-entry: Unable to read Webpack stats file at path (.*public\/webpack.stats.json)\. https:\/\/webpack.js.org\/api\/stats\/\.$/)
      })

      test('should set the head and post body scripts for each entry', () => {
        onRenderBody({
          setHeadComponents: setHeadComponentsSpy,
          setPostBodyComponents: setPostBodyComponentsSpy
        }, {
          entry: { 'super-app': 'super-app.js' },
          webpackStatsFilePath: path.resolve(__dirname, '../test/fixtures/gatsby-ssr/good-stats.json')
        })

        expect(setHeadComponentsSpy).toHaveBeenCalledTimes(1)
        expect(setHeadComponentsSpy.mock.calls[0].length).toEqual(1)
        expect(setPostBodyComponentsSpy).toHaveBeenCalledTimes(1)
        expect(setHeadComponentsSpy.mock.calls[0].length).toEqual(1)
      })
    })
  })
})
