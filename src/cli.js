#!/usr/bin/env node
import {program} from 'commander'
import main from './index.js'

program.version('0.1.0')

program
  .option(
    '-t, --target <path>',
    'The path to a directory to be made into a PDF. The flag can be omitted.',
  )
  .option(
    '-a, --author <name>',
    'will be filled in on the title page and every header',
  )
  .option(
    '-o, --outPath <path>',
    'output location. Tilde notation currently not accepted :(',
  )
  .option(
    '-d, --dry',
    `Add -d to enable a dry run that produces only a JSON
    representing the order in which files will be assembled.`,
  )
  .option(
    '-j, --json <path>',
    `Pass in the location of a JSON file to specify your own order of files instead.
    Most useful after trying out the -d option to see what a config should look like.`,
  )
  .option(
    '-dh --dryHTML',
    'Like the dry run option, but produces just HTML output. No page numbers though :(',
  )
  .option(
    '-s --stylePath <path>',
    'Path to a HTML file with configurations that will be used to style the PDF.',
  )
  .option('-q --quietly', 'Suppress all debugging messages')
  .option(
    '-e --exclude <patterns...>',
    `Specify regex patterns for files to exclude. Default excludes node_modules,
.git, yarn.lock and package-lock.json, and .env files.
Codexer also excludes any non-text encoded files; this cannot be altered.`,
  )

program.parse()

const opts = program.opts()
const target = opts.target || program.args[0]
delete opts.target

main(target, program.opts())
