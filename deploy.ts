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

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import {ChildProcess, execSync} from 'child_process'
import {basename, resolve} from 'path'
// endregion
const run = (command:string, options = {}):string =>
    execSync(command, {encoding: 'utf-8', shell: '/bin/bash', ...options})

if (run('git branch').includes('* master')) {
    console.info('Build new web page.')
    run('yarn build')

    let currentWorkingDirectoryPath:string = run('pwd')
    const parentWebsitePath:string = resolve(
        currentWorkingDirectoryPath,
        '../',
        `${basename(currentWorkingDirectoryPath)}.github.io`
    )

    let target = './'
    let workingPath = './'
    if (run('git branch').includes('gh-pages')) {
        console.info('Checkout distribution branch.')
        run('git checkout gh-pages')
    } else if (parentWebsitePath) {
        target = `${parentWebsitePath}/build/`
        workingPath = parentWebsitePath
    } else
        console.warn('No website target found.')

    console.info('Update page data.')
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

    console.info('Upload compiled webpage')
    run('git pull', {cwd: workingPath})
    run('git add --all', {cwd: workingPath})
    run(
        `git commit --message 'Automatic page build update.'`,
        {cwd: workingPath}
    )
    run('git push', {cwd: workingPath})

    if (run('git branch').includes('gh-pages'))
        console.info('Switch back to source directory.')
    else {
        console.info('Switch back to master branch.')
        run('git checkout master')
    }
}
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
