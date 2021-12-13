#!/usr/bin/env node

const { mainModule } = require('process');
const DATA_FILE = './data/dictionary.txt'

async function waitWord () {
  const { prompt } = require('enquirer');

  const response = await prompt({
    type: 'input',
    name: 'word',
    message: 'Input english word:'
  });
  const word = response['word']
  if (word) await searchDictionary(word);
  return (word ? 0 : 1)
}

async function searchDictionary (word) {
  const fs = require('fs')
  const readline = require('readline')
  const rs = fs.createReadStream(DATA_FILE)
  const rl = readline.createInterface({
      input: rs
  });
  let pageNumber
  for await (const line of rl) {
    let lineLc = line.toLowerCase()
    let wordLc = word.toLowerCase()
    if (line.includes('P') && !line.includes(':')) pageNumber = line
    if (lineLc.includes(wordLc)) {
      console.log(`${pageNumber}) ${lineLc.trim()}`)
    }
  }
}

async function main () {
  let loopEnd = 0
  while (loopEnd == 0) {
    loopEnd = await waitWord()
  }
  console.log('bye.')
}

main();
