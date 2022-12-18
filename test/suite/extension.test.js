const mocha = require('mocha')
const describe = mocha.describe
const it = mocha.it
const assert = require('assert')

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode')
// const myExtension = require('../extension');

describe('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.')

  it('Sample test', async function () {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5))
    assert.strictEqual(-1, [1, 2, 3].indexOf(0))
  })
})
