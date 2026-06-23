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
import {rimraf as removeDirectoryRecursively} from 'rimraf'
// endregion
export const USERNAME = 'thaibault'
export const PUBLIC_REPOSITORY_NAME = `${USERNAME}.github.io`

export const log = new Logger({name: 'website-utilities.deploy'})

const run = (command: string, options = {}): string =>
    execSync(command, {encoding: 'utf-8', shell: '/bin/bash', ...options})

if (run('git branch').includes('* main')) {
    log.info('Build new web page.')
    run('yarn build')

    const publicWebsitePath: string = resolve('../', PUBLIC_REPOSITORY_NAME)

    if (!await isDirectory(publicWebsitePath)) {
        run(
            `git clone git@github.com:${USERNAME}/${PUBLIC_REPOSITORY_NAME} ` +
            publicWebsitePath
        )


    log.info('Update page data.')
    removeDirectoryRecursively({filter: (path) => console.log(path) || Promise.resolve(path ? false : true)})

    /*
    run(`
        rsync \
            './build/' \
            '${publicWebsitePath}' \
            $ILU_RSYNC_DEFAULT_ARGUMENTS \
            --exclude=CNAME \
            --exclude='.*' \
            --exclude=node_modules \
            --exclude=readme.md \
            --exclude=./build
    `)
    */

    removeDirectoryRecursively('build')

    log.info('Upload compiled webpage')
    run('git pull', {cwd: publicWebsitePath})
    run('git add --all', {cwd: publicWebsitePath})
    run(
        `git commit --message 'Automatic page build update.'`,
        {cwd: publicWebsitePath}
    )
    run('git push', {cwd: publicWebsitePath})
}
