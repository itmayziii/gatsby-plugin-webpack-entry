import { describe, test, expect } from '@jest/globals'
import { isWebpackEntryObject, overlappingKeys, validatePluginOptions } from './utilities'

describe('helpers', () => {
  describe('validatePluginOptions', () => {
    test('should throw an error if the entry option is not a webpack entry object', () => {
      const expectedError = new Error([
        'gatsby-plugin-webpack-entry: Option "entry" must use Webpack\'s object syntax.',
        'https://github.com/itmayziii/gatsby-plugin-webpack-entry#available-options.',
        'https://webpack.js.org/concepts/entry-points/#object-syntax.'
      ].join(' '))
      expect(() => {
        validatePluginOptions({
          plugins: [],
          entry: './src/app.js'
        })
      })
        .toThrow(expectedError)
    })

    test('should throw an error if supplied "entry" argument is an empty object', () => {
      const expectedError = new Error([
        'gatsby-plugin-webpack-entry: Option "entry" must be a non empty object otherwise this plugin provides no',
        'value and should be removed. https://github.com/itmayziii/gatsby-plugin-webpack-entry#available-options.',
        'https://webpack.js.org/concepts/entry-points/#object-syntax.'
      ].join(' '))
      expect(() => { validatePluginOptions({ plugins: [], entry: {} }) })
        .toThrow(expectedError)
    })

    test('should return the plugin options passed in', () => {
      const actual = validatePluginOptions({
        plugins: [],
        entry: { 'super-app': './src/super-app.js' }
      })
      const expected = { entry: { 'super-app': './src/super-app.js' }, plugins: [] }
      expect(actual).toEqual(expected)
    })
  })

  describe('isWebpackEntryObject', () => {
    test('should return false if the provided entry is null', () => {
      const actual = isWebpackEntryObject(null)
      expect(actual).toBe(false)
    })

    test('should return false if the provided entry is undefined', () => {
      const actual = isWebpackEntryObject(undefined)
      expect(actual).toBe(false)
    })

    test('should return false if the provided entry is a string', () => {
      const actual = isWebpackEntryObject('./src/app.js')
      expect(actual).toBe(false)
    })

    test('should return false if the provided entry is a function', () => {
      const actual = isWebpackEntryObject(() => './src/app.js')
      expect(actual).toBe(false)
    })

    test('should return false if the provided entry is an array', () => {
      const actual = isWebpackEntryObject(['./src/app.js', './src/app2.js'])
      expect(actual).toBe(false)
    })

    test('should return true if the provided entry is a Webpack entry object', () => {
      const actual = isWebpackEntryObject({ app: './src/app.js' })
      expect(actual).toBe(true)
    })
  })

  describe('overlappingKeys', () => {
    test('should return an empty array if no keys overlap between objects', () => {
      const actual = overlappingKeys({ a: 'a', c: 'c' }, { b: 'b', d: 'd' })
      const expected: string[] = []
      expect(actual).toEqual(expected)
    })

    test('should return an array of keys that overlap between objects', () => {
      const actual = overlappingKeys({ a: 'a', c: 'c' }, { a: 'apples', c: 'cats' })
      const expected: string[] = ['a', 'c']
      expect(actual).toEqual(expected)
    })
  })
})
