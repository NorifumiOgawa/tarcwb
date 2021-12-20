#!/usr/bin/env node

const path = require('path')
const DATA_FILE = path.join(__dirname, 'dictionary.txt')
const fs = require('fs')
const readline = require('readline')
const { prompt } = require('enquirer')

async function waitWord () {
  const response = await prompt({
    type: 'input',
    name: 'word',
    message: 'Input english word'
  })
  const word = response.word
  if (!word) return true
  const numberPattern = /^([1-9]\d*|0)$/
  const rs = fs.createReadStream(DATA_FILE)
  const rl = readline.createInterface({ input: rs })
  if (numberPattern.test(word)) {
    await searchPage(rl, word)
  } else if (word) {
    await searchWord(rl, word)
  }
  return false
}

async function searchPage (rl, word) {
  let currentPage = false
  let counter = 0
  for await (const line of rl) {
    const targetPagelabel = 'P' + word
    if (line === targetPagelabel) {
      currentPage = true
    } else if (currentPage && line.includes('P') && !line.includes(':')) {
      break
    } else if (currentPage && line) {
      counter++
      console.log(`${targetPagelabel}~) ${line.slice(1).trim()}`)
    }
  }
  if (counter === 0) { console.log('not found.') }
}

async function searchWord (rl, word) {
  let counter = 0
  let pageNumber
  for await (const line of rl) {
    const lineLc = line.toLowerCase()
    const wordLc = word.toLowerCase()
    if (line.includes('P') && !line.includes(':')) pageNumber = line
    if (lineLc.includes(wordLc)) {
      counter++
      console.log(`${pageNumber}~) ${line.slice(1).trim()}`)
    }
  }
  if (counter === 0) { console.log('not found.') }
}

async function main () {
  let loopEnd = false
  while (loopEnd === false) {
    loopEnd = await waitWord()
  }
  console.log('bye.')
}

main()
