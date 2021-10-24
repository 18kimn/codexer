/*
  give the file object from fileProcessing/getAllFiles as input, 
  produce a markdown nested numbered list

  This is mostly a recursive solution that adds indentation levels with each 
    recursion. It's wrapped in a function that adds `.join('\n')` on it
    to make the array into a file-writable string
*/
import marked from 'marked'
import {fileObjToArray} from './fileProcessing.js'
import {baseOpts, getPageCount} from './utils.js'
import prettier from 'prettier'
import pdf from 'html-pdf'
import {promises as fs} from 'fs'
import {fileURLToPath} from 'url'
import {join} from 'path'
import {dirname} from 'path'

const makeRow = (filename, pageNum, indent, index) => {
  const spaces = Array(indent).fill('&nbsp;').join('')
  const item = `<span>${index + 1}. ${filename}</span>`
  return `|<span>${spaces}<span/>${item}| ${pageNum}  |`
}

const makeTOCArray = async (
  fileObj,
  fileArray,
  pageCounts,
  indent = 0,
  parent = '',
) => {
  parent = parent ? parent + '/' : ''

  return fileObj.reduce(async (prev, curr, index) => {
    prev = await prev
    const filename = typeof curr === 'string' ? curr : Object.keys(curr)[0]
    if (!Object.values(curr)[0].length) return prev
    const fileIndex = fileArray.findIndex((node) => node === parent + filename)
    const pageNum = fileIndex === 0 ? 1 : (await pageCounts[fileIndex - 1]) + 1
    const row = makeRow(filename, pageNum || '', indent, index)
    const toAdd =
      typeof curr === 'string'
        ? [row]
        : [
            row,
            ...(await makeTOCArray(
              Object.values(curr)[0],
              fileArray,
              pageCounts,
              indent + 4,
              parent + filename,
            )),
          ]
    return [...prev, ...toAdd]
  }, new Promise((resolve) => resolve([])))
}

const makeTOC = async (fileObj, header, entryBuffers, dims) => {
  const footer = {
    height: '20mm',
    contents: {
      default: await fs.readFile(
        join(dirname(fileURLToPath(import.meta.url)), 'tocFooter.html'),
        'utf-8',
      ),
    },
  }

  const pageCountPromises = Promise.all(entryBuffers.map(getPageCount))
  const pageCounts = (await pageCountPromises)
    .reduce((prev, curr) => [...prev, curr + prev[prev.length - 1]], [0])
    .slice(1)

  const fileArray = fileObjToArray(fileObj)
  const tocPromises = await makeTOCArray(fileObj, fileArray, pageCounts)
  const tocArray = await Promise.all(tocPromises)
  const tocMd = `

  <div style="width:100%;text-align:center;">
  <a name="toc"><h1>Table of Contents</h1></a>
  </div>
  
  |  |  |
  ---------| -------------
  ${tocArray.join('\n')}
  `

  const prettiered = prettier.format(tocMd, {
    filepath: 'placeholder.md',
  })
  const html = marked(`
${header}
<style>
table{width: 100%;}
span, tr{font-size: 10pt;}
</style>
${prettiered}`)

  return new Promise((resolve) => {
    pdf.create(html, {...baseOpts, footer, ...dims}).toBuffer((_, buffer) => {
      resolve(buffer)
    })
  })
}

export default makeTOC
