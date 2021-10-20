import hljs from 'highlight.js'
import {promises as fs} from 'fs'
import {extname, join} from 'path'
import {makeLink, langs, updateConsole} from './utils.js'
import prettier from 'prettier'

Object.keys(langs).map((lang) => hljs.registerLanguage(lang, langs[lang]))

const prettierSupported = prettier
  .getSupportInfo()
  .languages.reduce((prev, curr) => [...prev, ...curr?.extensions], [])

const highlight = async (filename, dirname, opts) => {
  const {quietly, index, totalLength} = opts
  updateConsole(quietly, `Highlighting entries... ${index + 1}/${totalLength}`)

  const basefilename = filename
  filename = join(dirname, filename)
  const text = await fs.readFile(filename, 'utf-8')
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

  return `
  
## <a name="${linkTag}">${basefilename}</a>

<pre><code>${highlighted}</pre></code>
  
  `
}

export default highlight
