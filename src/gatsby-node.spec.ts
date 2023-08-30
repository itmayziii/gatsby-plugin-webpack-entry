import { describe, beforeEach, expect, test, jest } from '@jest/globals'
import gatsbyNode from './gatsby-node'
import { type Configuration } from 'webpack'
import { type PluginCallback, type PluginOptions, type CreateWebpackConfigArgs } from 'gatsby'

describe('gatsby-node', () => {
  describe('onCreateWebpackConfig', () => {
    let webpackConfig: Configuration
    let replaceWebpackConfigMock: jest.Mock<(config: Configuration) => void>
    let onCreateWebpackConfigCb: jest.Mock<PluginCallback>
    let createWebpackConfigArgs: CreateWebpackConfigArgs
    let onCreateWebpackConfigActions: CreateWebpackConfigArgs['actions']

    function getConfig (): Configuration {
      return webpackConfig
    }

    beforeEach(() => {
      webpackConfig = {
        entry: {
          app: 'app.js'
        }
      }
      replaceWebpackConfigMock = jest.fn().mockName('replaceWebpackConfig')
      onCreateWebpackConfigCb = jest.fn().mockName('onCreateWebpackConfigCb')
      // @ts-expect-error intentionally missing the other action properties as we only need "replaceWebpackConfig"
      onCreateWebpackConfigActions = { replaceWebpackConfig: replaceWebpackConfigMock }
      // @ts-expect-error intentionally not caring about all the arguments, only the ones we use / need tested
      createWebpackConfigArgs = { getConfig, actions: onCreateWebpackConfigActions }
    })

    test('should not do anything if the stage is not "develop" or "build-javascript"', () => {
      const actual = (stage: CreateWebpackConfigArgs['stage']) => async () => {
        await gatsbyNode?.onCreateWebpackConfig(
          { ...createWebpackConfigArgs, stage },
          { entry: { 'super-app': './src/super-app.js' }, plugins: [] },
          onCreateWebpackConfigCb)
      }
      // @ts-expect-error intentionally invalid stage for test
      actual('bananas')
      // @ts-expect-error intentionally invalid stage for test
      actual('do-not-build-javascript')
      expect(replaceWebpackConfigMock).toHaveBeenCalledTimes(0)
    })

    test('should throw an error if validating the plugin options fails', async () => {
      // entry is not allowed to be undefined
      const invalidPluginOptions: PluginOptions = { plugins: [], entry: undefined }
      const actual = (stage: CreateWebpackConfigArgs['stage']) => async () => {
        await gatsbyNode?.onCreateWebpackConfig(
          { ...createWebpackConfigArgs, stage },
          invalidPluginOptions,
          onCreateWebpackConfigCb)
      }

      await expect(actual('develop')).rejects.toThrow()
      await expect(actual('build-javascript')).rejects.toThrow()
    })

    test('should throw an error if Gatsby\'s Webpack entry configuration is not using the object syntax', async () => {
      webpackConfig = {
        entry: './src/gatsby-app.js'
      }

      const expectedError = new Error([
        'gatsby-plugin-webpack-entry: Gatsby\'s Webpack configuration is not what this plugin is expecting.',
        'It is possible you are using a version of Gatsby that does not work with this plugin or',
        'another plugin is modifying the Webpack configuration in a way that is not compatible with this plugin.',
        'Please open an issue at https://github.com/itmayziii/gatsby-plugin-webpack-entry/issues/new/choose.'
      ].join(' '))
      const actual = (stage: CreateWebpackConfigArgs['stage']) => async () => {
        await gatsbyNode?.onCreateWebpackConfig({ ...createWebpackConfigArgs, stage },
          { entry: { 'super-app': './src/super-app.js' }, plugins: [] },
          onCreateWebpackConfigCb)
      }

      await expect(actual('develop')).rejects.toThrow(expectedError)
      await expect(actual('build-javascript')).rejects.toThrow(expectedError)
    })

    test('should throw an error provided entry keys overlap with existing Gatsby Webpack entry config', async () => {
      const expectedError = new Error([
        'gatsby-plugin-webpack-entry: Provided plugin "entry" option has keys that would overlap with Gatsby.',
        'You should avoid overlapping keys as it will override the JavaScript Gatsby is attempting to compile with',
        'Webpack. Overlapping keys: app'
      ].join(' '))
      const actual = (stage: CreateWebpackConfigArgs['stage']) => async () => {
        await gatsbyNode?.onCreateWebpackConfig(
          { ...createWebpackConfigArgs, stage },
          { entry: { app: './src/super-app.js' }, plugins: [] },
          onCreateWebpackConfigCb)
      }

      await expect(actual('develop')).rejects.toThrow(expectedError)
      await expect(actual('build-javascript')).rejects.toThrow(expectedError)
    })

    // https://webpack.js.org/concepts/entry-points/#entrydescription-object
    test('should include the entry value without modification if the object is an EntryDescription object', () => {
      const actual = (stage: CreateWebpackConfigArgs['stage']): void => {
        void gatsbyNode?.onCreateWebpackConfig(
          { ...createWebpackConfigArgs, stage },
          {
            // https://webpack.js.org/concepts/entry-points/#entrydescription-object
            entry: {
              [`${stage}-b2`]: {
                runtime: 'x2',
                dependOn: 'a2',
                import: './b'
              }
            },
            plugins: []
          },
          onCreateWebpackConfigCb)
      }

      actual('develop')
      let expected: Record<string, string | object> = {
        app: 'app.js',
        'develop-b2': {
          runtime: 'x2',
          dependOn: 'a2',
          import: './b'
        }
      }
      expect(replaceWebpackConfigMock.mock.calls[0][0].entry).toEqual(expected)

      actual('build-javascript')
      expected = {
        app: 'app.js',
        'build-javascript-b2': {
          runtime: 'x2',
          dependOn: 'a2',
          import: './b'
        }
      }
      expect(replaceWebpackConfigMock.mock.calls[1][0].entry).toEqual(expected)

      expect(replaceWebpackConfigMock).toHaveBeenCalledTimes(2)
    })

    describe('stage = "develop" i.e. "gatsby develop"', () => {
      const stage = 'develop'

      test('should include the webpack-hot-middleware if entry value is a string', async () => {
        await gatsbyNode?.onCreateWebpackConfig(
          { ...createWebpackConfigArgs, stage },
          { entry: { 'super-app': './src/super-app.js' }, plugins: [] },
          onCreateWebpackConfigCb)
        expect(replaceWebpackConfigMock).toHaveBeenCalledTimes(1)
        const expected = {
          app: 'app.js',
          'super-app': [
            'webpack-hot-middleware/client.js?path=/__webpack_hmr&reload=true&overlay=false',
            './src/super-app.js'
          ]
        }
        expect(replaceWebpackConfigMock.mock.calls[0][0].entry).toEqual(expected)
      })

      test('should include the webpack-hot-middleware if entry value is an array of strings', async () => {
        await gatsbyNode?.onCreateWebpackConfig(
          { ...createWebpackConfigArgs, stage },
          { entry: { 'super-app': ['./src/super-app.js', './src/super-app-2.js'] }, plugins: [] },
          onCreateWebpackConfigCb)
        expect(replaceWebpackConfigMock).toHaveBeenCalledTimes(1)
        const expected = {
          app: 'app.js',
          'super-app': [
            'webpack-hot-middleware/client.js?path=/__webpack_hmr&reload=true&overlay=false',
            './src/super-app.js',
            './src/super-app-2.js'
          ]
        }
        expect(replaceWebpackConfigMock.mock.calls[0][0].entry).toEqual(expected)
      })
    })

    describe('stage = "build-javascript" i.e. "gatsby build"', () => {
      const stage = 'build-javascript'

      test('should include the provided script if the entry value is a string', async () => {
        await gatsbyNode?.onCreateWebpackConfig(
          { ...createWebpackConfigArgs, stage },
          { entry: { 'super-app': './src/super-app.js' }, plugins: [] },
          onCreateWebpackConfigCb)
        expect(replaceWebpackConfigMock).toHaveBeenCalledTimes(1)
        const expected = {
          app: 'app.js',
          'super-app': './src/super-app.js'
        }
        expect(replaceWebpackConfigMock.mock.calls[0][0].entry).toEqual(expected)
      })

      test('should include the provided script if the entry value is an array of strings', async () => {
        await gatsbyNode?.onCreateWebpackConfig(
          { ...createWebpackConfigArgs, stage },
          { entry: { 'super-app': ['./src/super-app.js', './src/super-app-2.js'] }, plugins: [] },
          onCreateWebpackConfigCb)
        expect(replaceWebpackConfigMock).toHaveBeenCalledTimes(1)
        const expected = {
          app: 'app.js',
          'super-app': [
            './src/super-app.js',
            './src/super-app-2.js'
          ]
        }
        expect(replaceWebpackConfigMock.mock.calls[0][0].entry).toEqual(expected)
      })
    })
  })
})
