import {getAllFiles, fileObjToArray} from './fileProcessing.js'
import highlight from './highlighter.js'
import makeTOC from './makeTOC.js'
import {promises as fs} from 'fs'
import {join, resolve, basename, dirname} from 'path'
import {platform, tmpdir} from 'os'
import makeTitlePage from './makeTitlePage.js'
import makeEntries from './makeEntries.js'
import {merge} from 'merge-pdf-buffers'
import {fileURLToPath} from 'url'
import {updateConsole} from './utils.js'
import marked from 'marked'
const __dirname = dirname(fileURLToPath(import.meta.url))

const main = async (target, options) => {
  const {
    author,
    outPath,
    dry,
    json,
    stylePath: headerPath,
    dryHTML: html,
    quietly,
    exclude,
  } = options || {}
  const {width, height} = options || {}
  const dims = {width: width || '152mm', height: height || '228mm'}
  if (!target) return
  const baseHeader = await fs.readFile(
    headerPath || join(__dirname, './header.html'),
  )

  // on linux, the default dpi messes phantomjs up.
  // See https://github.com/marcbachmann/node-html-pdf/issues/525
  const zoom = `
<style>
html {
  zoom: ${platform() === 'linux' ? 0.753 : 1};
}
</style>
`
  const header = zoom + baseHeader

  // we want to safely save to a temp directory
  //  if a specific path is not given
  const outDir = outPath ? dirname(target) : join(tmpdir(), 'codexer')
  fs.mkdir(outDir, {recursive: true}, (err) => {
    if (err && err !== 'EEXIST') throw err
  })
  const resolvedOutPath =
    outPath || join(outDir, `${basename(resolve(target))}.pdf`)

  // handle user-specified exclusions
  const defaultExclusions = [/node_modules/, /\.git/, /lock/, /\.env/]
  const exclusions = exclude?.map((str) => new RegExp(str)) || defaultExclusions

  let fileObj
  if (dry) {
    const json = getAllFiles(resolve(target), exclusions)
    const jsonPath = join(outDir, `${basename(resolve(target))}.json`)

    await fs.writeFile(jsonPath, JSON.stringify(json))
    console.log(`dry run finished; json written to ${jsonPath}`)
    return
  } else if (typeof json === 'string') {
    fileObj = JSON.parse(await fs.readFile(resolve(json), {encoding: 'utf-8'}))
  } else {
    fileObj = getAllFiles(resolve(target), exclusions)
  }

  const fileArray = fileObjToArray(fileObj)

  // creating buffers for each section
  const entries = await Promise.all(
    fileArray.map((filename, index) => {
      const opts = {quietly, index, totalLength: fileArray.length}
      return highlight(filename, target, opts)
    }),
  )

  if (html) {
    const htmlPath = join(outDir, `${basename(resolve(target))}.html`)
    await fs.writeFile(
      htmlPath,
      header +
        marked(entries.join('<div style="page-break-after: always;"></div>')),
    )
    updateConsole(quietly, `HTML file written to ${htmlPath}\n`)
    return
  }

  updateConsole(quietly, 'creating title page and table of contents buffers...')
  const titleBuffer = makeTitlePage(target, author || '', dims)
  const entryBuffers = await makeEntries(entries, header, quietly, dims)
  const tocBuffer = makeTOC(fileObj, header, entryBuffers, dims)

  updateConsole(quietly, 'writing file to disk...')
  // assembling buffers and writing
  return Promise.all([titleBuffer, tocBuffer, ...entryBuffers])
    .then((buffers) => merge(buffers))
    .then((merged) => fs.writeFile(resolvedOutPath, merged))
    .then(() =>
      updateConsole(
        quietly,
        `Finished! PDF is located at ${resolvedOutPath}\n`,
      ),
    )
}

// main('../../work/aemp/evictorbook', 'The Anti-Eviction Mapping Project')

export default main
