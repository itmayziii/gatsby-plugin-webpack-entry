# gatsby-plugin-webpack-entry
Adds entry points in the webpack configuration and includes those entry points in your Gatsby compiled HTML files.

:warning: This plugin relies on [replaceWebpackConfig][gatsby-replace-webpack] which has the potential to break future 
versions of Gatsby. The maintainers will do their best to keep this plugin working with Gatsby v2+ :warning:

## Usage
### Installing
* NPM - `npm install gatsby-plugin-webpack-entry`
* Yarn - `yarn add gatsby-plugin-webpack-entry`

### Available Options
`entry`: `{ [key: string]: string } (required)`
* Specify the entry points just like you would in a [webpack configuration][webpack-entry-points], these are merged in 
with entry points Gatsby includes by default.
* The value should be an absolute path like `path.resolve(__dirname, 'src', 'super-app.js')`

`webpackStatsFilePath`: `string (optional)`
* Specify a path to a custom webpack.stats.json file, this would be rare to use as if gatsby was compiling somewhere 
else besides the public directory. 
* The value should be an absolute path like `path.resolve(__dirname, 'other-public', 'webpack.stats.json')`

### When do I use this plugin?
Use this plugin if you need to load your own Javascript files outside the normal Gatsby created bundles.

### Example
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

## How to Develop Locally
This project relies on Typescript for all the type safety goodness which can be found in the `src` directory. The 
compiled output goes directly into the root of the project because Gatsby expects [certain files][gatsby-plugin-files] 
to be in the root.

### Dev Workflow
1. Get the latest updates `npm install`.
2. Run `npm run watch` to tell typescript to listen to changes in the `src` directory and recompile on the fly.
3. Link this package to an actual gatsby project to test the plugin working, there is a good article for this
[here][using-npm-link].

### Helpful Commands
* Run tests - `npm run test`
* Lint - `npm run lint`
* Compile Typescript - `npm run build`
* Watch Typescript source and compile on change - `npm run watch`

## How to contribute
* Please open an issue first so that it can be determined that the feature / issue needs to be implemented / fixed.
* If it is determined that the feature / issue is something this plugin should address then feel free to fork the repo 
and make a pull request.
* This project makes use of [conventional commits][conventional-commits] and your commits should follow this standard. 
In order to make following this convention easy this project uses an NPM package called [commitizen][commitizen]. Just
run `npm run commit` and follow the prompts provided when you're ready to make a git commit.
* Before making a pull request please make sure the tests are passing `npm run test` and the linter is happy `npm run lint`.

[webpack-entry-points]: https://webpack.js.org/concepts/entry-points/
[gatsby-plugin-files]: https://www.gatsbyjs.org/docs/files-gatsby-looks-for-in-a-plugin/
[using-npm-link]: https://medium.com/@vcarl/problems-with-npm-link-and-an-alternative-4dbdd3e66811
[conventional-commits]: https://www.conventionalcommits.org/en/v1.0.0/
[commitizen]: https://www.npmjs.com/package/commitizen
[gatsby-replace-webpack]: https://www.gatsbyjs.org/docs/actions/#replaceWebpackConfig
