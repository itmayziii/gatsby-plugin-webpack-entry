import { type NightwatchTests } from 'nightwatch'

const home: NightwatchTests = {
  'Google title test': () => {
    return browser.url('https://google.com/ncr').assert.titleEquals('Google')
  },

  'Google search test': () => {
    return browser
      .setValue('textarea[name=q]', 'nightwatchjs')
      .perform(function (this: any) {
        const actions = this.actions({ async: true })

        return actions.keyDown(this.Keys.ENTER).keyUp(this.Keys.ENTER)
      })
      .waitForElementVisible('#main')
      .assert.textContains('#main', 'Nightwatch.js')
  }
}

export default home
