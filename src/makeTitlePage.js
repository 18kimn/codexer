import {basename, resolve} from 'path'
import {baseOpts} from './utils.js'
import pdf from 'html-pdf'
const makeTitlePage = (target, author) => {
  const titlePage = `
<div style="width:100%; text-align: center;">
  <div style="height: 5cm;"></div>
  <h1 style="width: 100%;">${basename(resolve(target))}</h1>
  <h3 style="width: 100%;">${author}</h3>
  <div style="height: 5cm;"></div>
</div>
`

  return new Promise((resolve) => {
    pdf.create(titlePage, baseOpts).toBuffer((_, buffer) => {
      resolve(buffer)
    })
  })
}

export default makeTitlePage
