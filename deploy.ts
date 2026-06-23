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
import {copyDirectoryRecursive, isDirectory, Logger} from 'clientnode'
import {execSync} from 'child_process'
import {basename, resolve} from 'path'
import {rimraf as removeDirectoryRecursively} from 'rimraf'
// endregion
export const USERNAME = 'thaibault'
export const PUBLIC_REPOSITORY_NAME = `${USERNAME}.github.io`

export const log =
    new Logger({name: 'website-utilities.deploy', level: 'info'})

const run = (command: string, options = {}): string =>
    execSync(command, {encoding: 'utf-8', shell: '/bin/bash', ...options})

if (run('git branch').includes('* main')) {
    log.info('Build new web page.')
    log.info(run('yarn clear'))
    log.info(run('yarn build'))

    const publicWebsitePath: string = resolve('../', PUBLIC_REPOSITORY_NAME)

    if (!await isDirectory(publicWebsitePath))
        log.info(run(
            `git clone git@github.com:${USERNAME}/${PUBLIC_REPOSITORY_NAME} ` +
            publicWebsitePath
        ))

    log.info(run('git pull', {cwd: publicWebsitePath}))

    log.info(`Update page data in "${publicWebsitePath}".`)

    await removeDirectoryRecursively(
        publicWebsitePath,
        {filter: (path) =>
            Promise.resolve(
                ![
                    publicWebsitePath,
                    resolve(publicWebsitePath, '.git'),
                    resolve(publicWebsitePath, '.github'),
                    resolve(publicWebsitePath, 'CNAME'),
                    resolve(publicWebsitePath, 'readme.md')
                ].some((ignorePath) => path.startsWith(ignorePath))
            )
        }
    )

    await copyDirectoryRecursive('build', publicWebsitePath, true)

    log.info(run('yarn clear'))

    log.info('Upload compiled webpage')
    log.info(run('git add --all', {cwd: publicWebsitePath}))
    log.info(run(
        `git commit --message 'Automatic page build update.'`,
        {cwd: publicWebsitePath}
    ))
    log.info(run('git push', {cwd: publicWebsitePath}))
}
