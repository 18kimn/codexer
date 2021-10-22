# codexer

### make a book out of a (code) directory

The de-facto way of looking at code is as a dry, machine-like, monospaced,
almost monotonous form of giving instructions to the computer. But I think code
is just as creative, colorful, vivid, and _textual_ as all of the other forms of
information we consume. Our unconscious perception of a divide between computer
programs and other forms of text prevents us from critiquing the actual language
of code, down to its individual variables and functions.

This (small) project tries to push back on that by providing a method to make
folders of code into books -- or really, just printable PDFs. It features syntax
highlighting with [highlight.js](https://highlightjs.org/), automagical
formatting with [prettier](https://prettier.io/), and a table of contents with
page numbers from my own hacky coding.

The actual PDF generation is done with
[html-pdf](https://github.com/marcbachmann/node-html-pdf/issues) with some
processing done in [pdf-parse](https://www.npmjs.com/package/pdf-parse).

### Usage (CLI)

Install with `npm install --global codexer`.

If you're new to Node, feel free to check out
[this guide](https://heynode.com/tutorial/install-nodejs-locally-nvm/).

```
codexer [options]

Options:
  -V, --version               output the version number
  -t, --target <path>         The path to a directory to be made into a PDF. The flag can be omitted.
  -a, --author <name>         will be filled in on the title page and every header
  -o, --outPath <path>        output location. Tilde notation currently not accepted :(
  -d, --dry                   Add -d to enable a dry run that produces only a JSON
      representing the order in which files will be assembled.
  -j, --json <path>           Pass in the location of a JSON file to specify your own order of files instead.
      Most useful after trying out the -d option to see what a config should look like.
  -dh --dryHTML               Like the dry run option, but produces just HTML output. No page numbers though :(
  -s --stylePath <path>       Path to a HTML file with configurations that will be used to style the PDF.
  -q --quietly                Suppress all debugging messages
  -e --exclude <patterns...>  Specify regex patterns for files to exclude. Default excludes node_modules,
                              .git, yarn.lock and package-lock.json, and .env files.
                              Codexer also excludes any non-text encoded files; this cannot be altered.
  -h, --help                  display help for command
```

### Usage (as a Node module)

You should probably stick to using it as a CLI tool or for just messing around,
as it's not really ready for production. But if you want, you can install with
`npm install codexer` in your Node project. Then use it as follows:

```js
const codexer = require('codexer')
// or
import codexer from 'codexer'

codexer('.')
// Finished! PDF is located at /tmp/codexer/[your directory basename].pdf

codexer('.', {outPath: 'output.pdf'})
// Finished! PDF is located at [path to your directory].pdf
```

All of the CLI options are available for use in the npm version.

### npx?

You can also call it as a single-use tool with npx if you have Node installed by
prefixing npx to the codexer commands, e.g. by running `npx codexer .`.

The problem is that phantomJS and pdf-parse, which this tool depends on, are
incredibly large (the local node_modules/ folder on my machine comes out to
184Mb). Download, load, and install times are quite long because of this.

If you intend on using this tool more than once, I'd recommend just installing
it globally.

### If this doesn't fit your use case

All in all, it probably doesn't! Please, please feel free to download and alter
it if you want an adjustment.
