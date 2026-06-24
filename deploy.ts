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
import {copyDirectoryRecursive, isFile, Logger} from 'clientnode'
import {execSync} from 'child_process'
import {resolve} from 'path'
import {rimraf as removeDirectoryRecursively} from 'rimraf'
// endregion
export const PUBLIC_REPOSITORY_PATH =
    process.env.PUBLIC_REPOSITORY_PATH ||
    resolve('../', `${process.env.GIT_PRIVATE_AUTHOR_NAME || ''}.github.io`)

export const log =
    new Logger({name: 'website-utilities.deploy', level: 'info'})

const run = (command: string, options = {}): string =>
    execSync(command, {encoding: 'utf-8', shell: '/bin/bash', ...options})

if (run('git branch').includes('* main')) {
    log.info('Build new web page.')
    log.info(run('yarn clear'))
    log.info(run('yarn build'))

    if (!await isFile(resolve(PUBLIC_REPOSITORY_PATH, 'CNAME')))
        throw new Error(
            `Missing public website directory in "${PUBLIC_REPOSITORY_PATH}"`
        )

    log.info(`Update page data in "${PUBLIC_REPOSITORY_PATH}".`)

    await removeDirectoryRecursively(
        PUBLIC_REPOSITORY_PATH,
        {filter: (path) =>
            Promise.resolve(
                ![
                    PUBLIC_REPOSITORY_PATH,
                    resolve(PUBLIC_REPOSITORY_PATH, '.git'),
                    resolve(PUBLIC_REPOSITORY_PATH, '.github'),
                    resolve(PUBLIC_REPOSITORY_PATH, 'CNAME'),
                    resolve(PUBLIC_REPOSITORY_PATH, 'readme.md'),
                    resolve(PUBLIC_REPOSITORY_PATH, 'public-repository')
                ].some((ignorePath) => path.startsWith(ignorePath))
            )
        }
    )

    await copyDirectoryRecursive('build', PUBLIC_REPOSITORY_PATH, true)

    log.info(run('yarn clear'))

    log.info('Upload compiled webpage')

    if (process.env.USER_NAME_GITHUB) {
        log.info(`Set git user name to "${process.env.USER_NAME_GITHUB}".`)
        log.info(run(
            `git config --global user.name '${process.env.USER_NAME_GITHUB}'`,
            {cwd: PUBLIC_REPOSITORY_PATH}
        ))
    }
    if (process.env.USER_EMAIL_GITHUB) {
        log.info(`Set git user email to "${process.env.USER_EMAIL_GITHUB}".`)
        log.info(run(
            `git config --global user.email '${process.env.USER_EMAIL_GITHUB}'`,
            {cwd: PUBLIC_REPOSITORY_PATH}
        ))
    }

    log.info(run(
        `git commit --all --message 'Automatic page build update.'`,
        {cwd: PUBLIC_REPOSITORY_PATH}
    ))
    log.info(run('git push', {cwd: PUBLIC_REPOSITORY_PATH}))
}
