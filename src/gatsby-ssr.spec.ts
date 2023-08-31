import path from 'path'
import { describe, test, expect, beforeEach, beforeAll, afterAll, jest } from '@jest/globals'
import { type RenderBodyArgs } from 'gatsby'
import { onRenderBody } from './gatsby-ssr'

describe('gatsby-ssr', () => {
  describe('onRenderBody()', () => {
    let setHeadComponentsMock: jest.Mock<RenderBodyArgs['setHeadComponents']>
    let setPostBodyComponentsMock: jest.Mock<RenderBodyArgs['setPostBodyComponents']>
    let onRenderBodyArgs: RenderBodyArgs
    beforeEach(() => {
      setHeadComponentsMock = jest.fn().mockName('setHeadComponents')
      setPostBodyComponentsMock = jest.fn().mockName('setPostBodyComponents')
      // @ts-expect-error we don't care about the other properties for this test
      onRenderBodyArgs = {
        setPostBodyComponents: setPostBodyComponentsMock,
        setHeadComponents: setHeadComponentsMock
      }
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
        onRenderBody?.(onRenderBodyArgs, {
          entry: { 'super-app': 'super-app.js' },
          plugins: [],
          webpackStatsFilePath: path.resolve(__dirname, '../test/fixtures/gatsby-ssr/good-stats.json')
        })

        expect(setHeadComponentsMock).toHaveBeenCalledTimes(1)
        expect(setHeadComponentsMock.mock.calls[0].length).toEqual(1)
        expect(setPostBodyComponentsMock).toHaveBeenCalledTimes(1)
        expect(setHeadComponentsMock.mock.calls[0].length).toEqual(1)
      })
    })

    describe('process.env.NODE_ENV = "production"', () => {
      beforeEach(() => {
        // We do some `jest.mock` function calls in these tests
        jest.resetModules()
      })

      let originalNodeEnv: string | undefined
      beforeAll(() => {
        originalNodeEnv = process.env.NODE_ENV
        process.env.NODE_ENV = 'production'
      })
      afterAll(() => {
        process.env.NODE_ENV = originalNodeEnv
      })

      test('should throw an error if the webpack stat file can not be read', () => {
        const expectedError = new Error([
          'gatsby-plugin-webpack-entry: Unable to read Webpack stats file.',
          'Please open an issue at https://github.com/itmayziii/gatsby-plugin-webpack-entry/issues/new/choose.',
          'https://webpack.js.org/api/stats/.'
        ].join(' '))
        expect(() => {
          onRenderBody?.(onRenderBodyArgs, {
            entry: { 'super-app': 'super-app.js' },
            plugins: [],
            webpackStatsFilePath: path.resolve(__dirname, 'does-not-exist.json')
          })
        })
          .toThrow(expectedError)
      })

      test('should throw an error if the webpack stat file can not be JSON parsed', () => {
        const expectedError = new Error([
          'gatsby-plugin-webpack-entry: Unable to read Webpack stats file.',
          'Please open an issue at https://github.com/itmayziii/gatsby-plugin-webpack-entry/issues/new/choose.',
          'https://webpack.js.org/api/stats/.'
        ].join(' '))
        expect(() => {
          onRenderBody?.(onRenderBodyArgs, {
            entry: { 'super-app': 'super-app.js' },
            plugins: [],
            webpackStatsFilePath: path.resolve(__dirname, '../test/fixtures/gatsby-ssr/malformed-stats.json')
          })
        })
          .toThrow(expectedError)
      })

      test('should throw an error if "assetsByChunkName" property is missing from webpack stats file', () => {
        jest.mock('./gatsby-stats.json', () => {
          return require(path.resolve(
            __dirname,
            '../test/fixtures/gatsby-ssr/missing-assets-by-chunk-name-stats.json'
          ))
        }, { virtual: true })

        const expectedError = new Error([
          'gatsby-plugin-webpack-entry: Gatsby\'s Webpack stats file is missing the "assetsByChunkName" property.',
          'It is possible you are using a version of Gatsby that does not work with this plugin or',
          'another plugin is modifying the Webpack stats file in a way that is not compatible with this plugin.',
          'Please open an issue at https://github.com/itmayziii/gatsby-plugin-webpack-entry/issues/new/choose.',
          'https://webpack.js.org/api/stats/.'
        ].join(' '))
        expect(() => {
          onRenderBody?.(onRenderBodyArgs, {
            entry: { 'super-app': 'super-app.js' },
            plugins: []
          })
        }
        ).toThrow(expectedError)
      })

      test('should throw an error if webpack stats file "assetsByChunkName" is missing the entry name', () => {
        jest.mock('./gatsby-stats.json', () => {
          return require(path.resolve(
            __dirname,
            '../test/fixtures/gatsby-ssr/missing-assets-by-chunk-name-entry-stats.json'
          ))
        }, { virtual: true })

        const expectedError = new Error([
          'gatsby-plugin-webpack-entry: Gatsby\'s Webpack stats file is missing the "assetsByChunkName["super-app"]"',
          'property. It is possible you are using a version of Gatsby that does not work with this plugin or',
          'another plugin is modifying the Webpack stats file in a way that is not compatible with this plugin.',
          'Please open an issue at https://github.com/itmayziii/gatsby-plugin-webpack-entry/issues/new/choose.',
          'https://webpack.js.org/api/stats/.'
        ].join(' '))
        expect(() => {
          onRenderBody?.(onRenderBodyArgs, {
            entry: { 'super-app': 'super-app.js' },
            plugins: []
          })
        }
        ).toThrow(expectedError)
      })

      test('should set the head and post body scripts for each entry', () => {
        jest.mock('./gatsby-stats.json', () => {
          return require(path.resolve(__dirname, '../test/fixtures/gatsby-ssr/good-stats.json'))
        }, { virtual: true })

        onRenderBody?.(onRenderBodyArgs, {
          entry: { 'super-app': 'super-app.js' },
          plugins: []
        })

        expect(setHeadComponentsMock).toHaveBeenCalledTimes(1)
        expect(setHeadComponentsMock.mock.calls[0].length).toEqual(1)
        expect(setPostBodyComponentsMock).toHaveBeenCalledTimes(1)
        expect(setHeadComponentsMock.mock.calls[0].length).toEqual(1)
      })
    })
  })
})
