import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import html from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'
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

export {makeLink, langs}
