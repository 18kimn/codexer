import pdf from 'html-pdf'
import marked from 'marked'
import {baseOpts, getPageCount, updateConsole} from './utils.js'

// first iterate through each document and make one pdf for each of them.
// this unfortunately cannot be done async since we need to know the length of each document

const getBuffer = async (entry, pageStartOffset = 0, opts) => {
  const {header, index, totalLength, quietly} = opts
  const footer = {
    height: '20mm',
    contents: {
      default: `<div id="pageNum" style="width: 100%; height:100%; text-align: center; 
          display: flex; place-items: center; place-content: center;">{{page}}</div>
          <script>
            const div = document.getElementById("pageNum")
            div.innerText = Number(div.innerText) + ${pageStartOffset}
          </script>`,
    },
  }

  const html = marked(header + entry)
  return new Promise((resolve) => {
    pdf.create(html, {...baseOpts, footer}).toBuffer(async (_, buffer) => {
      updateConsole(
        quietly,
        `creating buffers for entries...${index}/${totalLength}`,
      )
      resolve(buffer)
    })
  })
}

const makeEntries = async (entries, header, quietly) => {
  let pageOffset = 0
  const buffers = entries.reduce(async (prev, curr, index) => {
    const opts = {header, index, totalLength: entries.length - 1, quietly}
    const prevArray = await prev
    const lastBuffer = await prevArray[prevArray.length - 1]
    pageOffset = lastBuffer
      ? pageOffset + (await getPageCount(lastBuffer))
      : pageOffset
    const currentBuffer = await getBuffer(curr, pageOffset, opts)

    return [...prevArray, currentBuffer]
  }, new Promise((resolve) => resolve([])))

  return buffers
}

export default makeEntries
