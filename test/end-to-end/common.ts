import { type NightwatchBrowser, type ElementFunction } from 'nightwatch'

export function openGatsby (gatsbyVersion: number): (browser: NightwatchBrowser) => Promise<void> {
  return async (browser) => {
    await browser.url(`http://localhost:900${gatsbyVersion}`)
  }
}

export function checkForScript (
  gatsbyVersion: number,
  element: ElementFunction
): (browser: NightwatchBrowser) => Promise<void> {
  return async (browser) => {
    const scriptEl = element('script[src^="super-app"]')
    await browser.expect.element(scriptEl).to.have.attribute('src')
      .which
      .matches(new RegExp(`^http:\\/\\/localhost:9002\\/super-app-v${gatsbyVersion}-(.*).js$`))
    await browser.expect.element(scriptEl).to.have.attribute('async').which.equals('true')
  }
}

// We know the script has executed when we can find the h1 element that the script added to the page
export function checkScriptExecuted (
  gatsbyVersion: number,
  element: ElementFunction
): (browser: NightwatchBrowser) => Promise<void> {
  return async (browser) => {
    const titleEl = element(`#gatsby-plugin-webpack-entry-gatsby-v${gatsbyVersion}`)
    await browser.waitForElementVisible(titleEl)
    await browser.expect.element(titleEl).text.to.equal('gatsby-plugin-webpack-entry is working!')
  }
}
