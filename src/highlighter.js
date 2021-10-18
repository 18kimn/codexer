import hljs from 'highlight.js'
import fs from 'fs'
import {extname, join} from 'path'
import {makeLink, langs} from './utils.js'
import prettier from 'prettier'

Object.keys(langs).map((lang) => hljs.registerLanguage(lang, langs[lang]))

const prettierSupported = prettier
  .getSupportInfo()
  .languages.reduce((prev, curr) => [...prev, ...curr?.extensions], [])

const highlight = (filename, dirname) => {
  console.log('working on ', filename)
  const basefilename = filename
  filename = join(dirname, filename)
  const text = fs.readFileSync(filename, 'utf-8')
  const ext = extname(filename).substring(1)
  const prettified =
    extname(filename) in prettierSupported
      ? prettier.format(text, {
          semi: false,
          filepath: filename,
        })
      : text
  const highlighted =
    ext && ext in Object.keys(langs)
      ? hljs.highlight(prettified, {language: ext}).value
      : hljs.highlightAuto(prettified).value
  const linkTag = makeLink(basefilename)
  console.log(filename + ' processed')
  return `
  
<div style="page-break-after: always;"></div>

## <a href="#toc"><a name="${linkTag}">${basefilename}</a></a>

<pre><code>${highlighted}</pre></code>
  
  `
}

export default highlight
