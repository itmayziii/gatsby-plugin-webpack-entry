import { type NightwatchTests, element } from 'nightwatch'
import { checkForScript, checkScriptExecuted, openGatsby } from './common'

const gatsbyVersion = 3

const gatsbyV3: NightwatchTests = {
  after: (browser, done) => {
    void browser.end(done)
  },

  'Gatsby v2': openGatsby(gatsbyVersion),
  'Gatsby v2 - has script tag': checkForScript(gatsbyVersion, element),
  'Gatsby v2 - script executes': checkScriptExecuted(gatsbyVersion, element)
}

export default gatsbyV3
