import {basename, resolve} from 'path'
import {baseOpts} from './utils.js'
import pdf from 'html-pdf'
const makeTitlePage = (target, author, dims) => {
  const titlePage = `
<div style="width:100%; text-align: center;">
  <div style="height: calc((${dims.height} - 1in) / 4);"></div>
  <h1 style="width: 100%;">${basename(resolve(target))}</h1>
  <h3 style="width: 100%;">${author}</h3>
  <div style="height: calc((${dims.height} - 1in) / 4);"></div>
</div>
`

  return new Promise((resolve) => {
    pdf.create(titlePage, {...baseOpts, ...dims}).toBuffer((_, buffer) => {
      resolve(buffer)
    })
  })
}

export default makeTitlePage
