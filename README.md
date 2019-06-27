## Description

Adds entry points in the webpack configuration and includes those entry points in your HTML.

## How to install

`npm install gatsby-plugin-webpack-entry` or `yarn add gatsby-plugin-webpack-entry`

:warning: This plugin relies on [replaceWebpackConfig](https://www.gatsbyjs.org/docs/actions/#replaceWebpackConfig) which has the potential to break future versions of Gatsby.
The maintainers will do their best to keep this plugin working with Gatsby V2+ :warning:

## Available options

`entry`: `{ [key: string]: string } (required)`
* specify the entry points just like you would in a [webpack configuration](https://webpack.js.org/concepts/entry-points/), these are merged in with Gatsbys.
* :warning: the value should be an absolute path like `path.resolve(__dirname, 'src', 'super-app.js')` 

## When do I use this plugin?

Use this plugin if you need to load your own Javascript files outside of the normal Gatsby created bundles.

## Examples of usage

```javascript
module.exports = {
  siteMetadata: {
    title: 'Budget Dumpster',
    description: 'Budget Dumpster specializes in local dumpster rentals for homeowners and contractors alike. Call us to rent a dumpster in your area.'
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-remove-trailing-slashes',
    'gatsby-plugin-postcss',
    'gatsby-plugin-react-svg', 
    {
      resolve: `gatsby-plugin-google-tagmanager`,
      options: {
        id: process.env.GATSBY_GTM_ID,
        includeInDevelopment: true
      }
    },
    {
      resolve: 'gatsby-plugin-webpack-entry', // <-- Here is the plugin
      options: {
        entry: {
          "super-app": path.resolve(__dirname, 'src', 'super-app.js')
        }
      }
    }  
  ]
}
```

## How to run tests
`npm run test`

## How to develop locally

This project relies on typescript for all the type safety goodness which can be found in the `src` directory. The compiled output goes directly into the root of the project because
Gatsby expects [certain files](https://www.gatsbyjs.org/docs/files-gatsby-looks-for-in-a-plugin/) to be in the root.

### Dev workflow

1. Get the latest updates `npm install`.
2. Run `npm run watch` to tell typescript to listen to changes in the `src` directory and recompile on the fly.
3. Link this package to an actual gatsby project to test the plugin working, there is a good article for this
[here](https://medium.com/@the1mills/how-to-test-your-npm-module-without-publishing-it-every-5-minutes-1c4cb4b369be).

## How to contribute

* Please open an issue first so that it can be determined that the feature / issue needs to be implemented / fixed.
* If it is determined that the feature / issue is something this plugin should address then feel free to fork the repo and make a pull request.
* This project makes use of [conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) and your commits should follow this standard. In order to make following
this convention easy this project uses an NPM package called [commitizen](https://www.npmjs.com/package/commitizen). Now this isn't just an arbitrary spec that this package is
forcing on you, as it turns out when you have standards around things you can build automation on top of it very easily. In the case of these standardized commit messages when this
package releases a new version it auto generates a changelog / version bump based on the commit messages. In order to easily commit just run `npm run commit` and you will guided
through a series of questions which will auto format the commit message for you.
* Before making a pull request please make sure the tests are passing `npm run test` and the linter is happy `npm run lint`.
