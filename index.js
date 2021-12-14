#!/usr/bin/env node

const DATA_FILE = './dictionary.txt'

async function waitWord () {
  const { prompt } = require('enquirer')

  const response = await prompt({
    type: 'input',
    name: 'word',
    message: 'Input english word'
  })
  const word = response.word
  if (word) await searchDictionary(word)
  return (word ? 0 : 1)
}

async function searchDictionary (word) {
  const fs = require('fs')
  const readline = require('readline')
  const rs = fs.createReadStream(DATA_FILE)
  const rl = readline.createInterface({
    input: rs
  })
  let pageNumber
  let counter = 0
  for await (const line of rl) {
    const lineLc = line.toLowerCase()
    const wordLc = word.toLowerCase()
    if (line.includes('P') && !line.includes(':')) pageNumber = line
    if (lineLc.includes(wordLc)) {
      counter++
      console.log(`${pageNumber}~) ${lineLc.slice(1).trim()}`)
    }
  }
  if (counter === 0) { console.log('not found.') }
}

async function main () {
  let loopEnd = 0
  while (loopEnd === 0) {
    loopEnd = await waitWord()
  }
  console.log('bye.')
}

main()
