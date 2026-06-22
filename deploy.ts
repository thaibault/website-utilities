// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module deploy */
'use strict'
/* !
    region header
    [Project page](https://torben.website/website-utilities)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import {Logger} from 'clientnode'
import {execSync} from 'child_process'
import {basename, resolve} from 'path'
// endregion
export const PUBLIC_REPOSITORY_NAME = 'thaibault.github.io'

export const log = new Logger({name: 'website-utilities.deploy'})

const run = (command: string, options = {}): string =>
    execSync(command, {encoding: 'utf-8', shell: '/bin/bash', ...options})

if (run('git branch').includes('* main')) {
    log.info('Build new web page.')
    run('yarn build')

    const parentWebsitePath: string = resolve('../', PUBLIC_REPOSITORY_NAME)

    let target = './'
    let workingPath = './'
    if (run('git branch').includes('gh-pages')) {
        log.info('Checkout distribution branch.')
        run('git checkout gh-pages')
    } else if (parentWebsitePath) {
        target = `${parentWebsitePath}/build/`
        workingPath = parentWebsitePath
    } else
        log.warn('No website target found.')

    log.info('Update page data.')
    run(`
        rsync \
            './build/' '${target}' \
            $ILU_RSYNC_DEFAULT_ARGUMENTS \
            --exclude=CNAME \
            --exclude='.*' \
            --exclude=node_modules \
            --exclude=readme.md \
            --exclude=./build
    `)

    run(`rm --recursive --force ./build`)

    log.info('Upload compiled webpage')
    run('git pull', {cwd: workingPath})
    run('git add --all', {cwd: workingPath})
    run(
        `git commit --message 'Automatic page build update.'`,
        {cwd: workingPath}
    )
    run('git push', {cwd: workingPath})

    if (run('git branch').includes('gh-pages'))
        log.info('Switch back to source directory.')
    else {
        log.info('Switch back to main branch.')
        run('git checkout main')
    }
}
