import hljs from 'highlight.js'
import {promises as fs} from 'fs'
import {extname, join} from 'path'
import {makeLink, langs, updateConsole} from './utils.js'
import prettier from 'prettier'
import marked from 'marked'

Object.keys(langs).map((lang) => hljs.registerLanguage(lang, langs[lang]))

const prettierSupported = prettier
  .getSupportInfo()
  .languages.reduce((prev, curr) => [...prev, ...curr?.extensions], [])

const highlight = async (filename, dirname, opts) => {
  const {quietly, index, totalLength} = opts

  const basefilename = filename
  filename = join(dirname, filename)
  const text = await fs.readFile(filename, 'utf-8')
  const ext = extname(filename).substring(1)

  const prettified = prettierSupported.includes(extname(filename))
    ? prettier.format(text, {
        // see https://prettier.io/docs/en/options.html
        semi: false,
        filepath: filename,
        singleQuote: true,
        quoteProps: 'preserve',
        bracketSpacing: false,
        trailingComma: 'all',
        printWidth: 80,
        proseWrap: 'always',
      })
    : text

  let formatted
  if (ext === 'md' || !ext) {
    // we want to render markdown text, not just format it
    formatted = marked(prettified)
  } else if (ext.replace('.', '') in Object.keys(langs)) {
    // for a few cases where hljs gets weird we need to manually specify languages
    formatted = hljs.highlight(prettified, {language: ext}).value
  } else {
    // but for most cases highlightAuto works fine
    formatted = hljs.highlightAuto(prettified).value
  }
  const linkTag = makeLink(basefilename)

  const codewrapper =
    ext === 'md' ? formatted : `<pre><code>${formatted}</pre></code>`
  updateConsole(quietly, `Highlighting entries... ${index + 1}/${totalLength}`)

  return `
  
## <a name="${linkTag}">${basefilename}</a>

${codewrapper}
  
  `
}

export default highlight
