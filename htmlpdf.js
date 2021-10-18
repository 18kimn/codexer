import fs from 'fs'
import pdf from 'html-pdf'
import {resolve} from 'path'
var html = fs.readFileSync('./intermediate.html', 'utf8')
var options = {
  timeout: '120000',
  width: '152mm',
  height: '228mm',
  paginationOffset: 2,
  base: 'file://' + resolve('.'),
  border: {
    top: '0.5in',
    right: '0.5in',
    bottom: '0.5in',
    left: '0.5in',
  },
  zoomFactor: '0.753',
  footer: {
    height: '20mm',
    contents: {
      default: `<div style="width: 100%; height:100%; text-align: center; 
        display: flex; place-items: center; place-content: center">{{page}}</div>`,
    },
  },
}

pdf.create(html, options).toFile('./out.pdf', function (err, res) {
  if (err) return console.log(err)
  console.log(res) // { filename: '/app/businesscard.pdf' }
})

// pagedjs-cli \
//   -i intermediate.html \
//   -o output.pdf \
//   -w 152mm -h 228mm \
//   --debug
