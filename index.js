#!/usr/bin/env node
const fs = require('fs')
const argv = require('yargs').argv
const datetime = require('datetime')
const dissect = require('./dissectMinutes')

const minutesFiles = argv._

const encoding = argv.encoding || 'utf8'

let minutes = []
for (let file of minutesFiles) {
  fs.readFile(file, encoding, (err, res) => {
    minutes.push(dissect.minutesFile(res))
    console.log(minutes[0])
  })
}

