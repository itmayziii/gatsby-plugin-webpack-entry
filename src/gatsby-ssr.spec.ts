import * as path from 'path'
import Spy = jasmine.Spy
import { onRenderBody } from './gatsby-ssr'

describe('gatsby-ssr.tsx', () => {
  describe('onRenderBody', () => {
    let setHeadComponentsSpy: Spy
    let setPostBodyComponentsSpy: Spy
    beforeEach(() => {
      setHeadComponentsSpy = jasmine.createSpy<any>('setHeadComponentsSpy')
      setPostBodyComponentsSpy = jasmine.createSpy<any>('setPostBodyComponentsSpy')
    })

    it('should throw an error if the stat file can not be read', () => {
      expect(() => {
        onRenderBody({ setHeadComponents: setHeadComponentsSpy, setPostBodyComponents: setPostBodyComponentsSpy }, {
          entry: { 'super-app': 'super-app.js' },
          webpackStatsFilePath: path.resolve('does-not-exist.json')
        })
      }
      ).toThrowError()
    })

    it('should throw an error if the stat file can not be JSON parsed', () => {
      expect(() => {
        onRenderBody({ setHeadComponents: setHeadComponentsSpy, setPostBodyComponents: setPostBodyComponentsSpy }, {
          entry: { 'super-app': 'super-app.js' },
          webpackStatsFilePath: path.resolve('test-data', 'bad-stats.json')
        })
      }
      ).toThrowError()
    })

    it('should set the head and post body scripts for each entry', () => {
      onRenderBody({ setHeadComponents: setHeadComponentsSpy, setPostBodyComponents: setPostBodyComponentsSpy }, {
        entry: { 'super-app': 'super-app.js' },
        webpackStatsFilePath: path.resolve('test-data', 'good-stats.json')
      })

      expect(setHeadComponentsSpy).toHaveBeenCalledTimes(1)
      expect(setHeadComponentsSpy.calls.argsFor(0).length).toEqual(1)
      expect(setPostBodyComponentsSpy).toHaveBeenCalledTimes(1)
      expect(setHeadComponentsSpy.calls.argsFor(0).length).toEqual(1)
    })
  })
})
