import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import html from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'
import pdfparse from 'pdf-parse'
// some languages are not included by default in hljs or have weird aliases

const langs = {
  json,
  markdown,
  html,
  yaml,
}

const makeLink = (filename) => {
  return filename.toLowerCase().replace(/\/|\./g, '-')
}

const getPageCount = (buffer) => {
  return pdfparse(buffer).then((data) => data.numpages)
}

const baseOpts = {
  timeout: '120000',
  width: '152mm',
  height: '228mm',
  border: {
    top: '0.5in',
    right: '0.5in',
    left: '0.5in',
  },
  zoomFactor: '0.753',
}

const updateConsole = (quietly, str) => {
  if (quietly) return
  process.stdout.clearLine()
  process.stdout.cursorTo(0)
  process.stdout.write(str)
}

export {makeLink, langs, getPageCount, baseOpts, updateConsole}
