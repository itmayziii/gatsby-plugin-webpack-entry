import { onCreateWebpackConfig } from './gatsby-node'
import Spy = jasmine.Spy

describe('gatsby-node.ts', () => {

  describe('onCreateWebpackConfig', () => {
    let webpackConfig: any
    let replaceWebpackConfigSpy: Spy

    function getConfig () {
      return webpackConfig
    }

    beforeEach(() => {
      webpackConfig = {
        entry: {
          app: 'app.js'
        },
        output: {
          library: 'someLibName',
          libraryTarget: 'umd',
          filename: 'someLibName.js',
          auxiliaryComment: 'Test Comment'
        }
      }
      replaceWebpackConfigSpy = jasmine.createSpy<any>('replaceHeadComponents')
    })

    it('should throw an error if the plugin options do not define an "entry" option', () => {
      // @ts-ignore
      expect(() => onCreateWebpackConfig({ stage: 'build-javascript', getConfig, actions: { replaceWebpackConfig: replaceWebpackConfigSpy } }, {}))
          .toThrow(new Error('gatsby-plugin-webpack-entry: Missing required option "entry". https://github.com/itmayziii/gatsby-plugin-webpack-entry#available-options'))
    })

    it('should throw an error if the plugin option "entry" is not an object', () => {
      // @ts-ignore
      expect(() => onCreateWebpackConfig({ stage: 'build-javascript', getConfig, actions: { replaceWebpackConfig: replaceWebpackConfigSpy } }, { entry: [] }))
          .toThrow(new Error('gatsby-plugin-webpack-entry: Option "entry" must be a non empty object. https://github.com/itmayziii/gatsby-plugin-webpack-entry#available-options'))
    })

    it('should throw an error if the plugin option "entry" is an object with no keys', () => {
      expect(() => onCreateWebpackConfig({ stage: 'build-javascript', getConfig, actions: { replaceWebpackConfig: replaceWebpackConfigSpy } }, { entry: {} }))
          .toThrow(new Error('gatsby-plugin-webpack-entry: Option "entry" must be a non empty object. https://github.com/itmayziii/gatsby-plugin-webpack-entry#available-options'))
    })

    it('should not touch the webpack config for any stage except "build-javascript"', () => {
      onCreateWebpackConfig({ stage: 'fake-stage', getConfig, actions: { replaceWebpackConfig: replaceWebpackConfigSpy } }, { entry: { 'super-app': 'super-app.js' } })
      expect(replaceWebpackConfigSpy).toHaveBeenCalledTimes(0)
    })

    it('should merge the webpack entry points when the build stage is "build-javascript"', () => {
      onCreateWebpackConfig({ stage: 'build-javascript', getConfig, actions: { replaceWebpackConfig: replaceWebpackConfigSpy } }, { entry: { 'super-app': 'super-app.js' } })
      expect(replaceWebpackConfigSpy).toHaveBeenCalledTimes(1)
      expect(replaceWebpackConfigSpy.calls.argsFor(0)[0].entry).toEqual({ app: 'app.js', 'super-app': 'super-app.js' })
    })
  })

})
