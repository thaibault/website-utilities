// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module deploy */
'use strict'
/* !
    region header
    [Project page](https://tsickert.com/website-utilities)

    Copyright Torben Sickert (info["~at~"]tsickert.com) 16.12.2012

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import {
    copyDirectoryRecursive, importFilesystemAPI, isFile, Logger
} from 'clientnode'
import {execSync} from 'child_process'
import {resolve} from 'path'
import {rimraf as removeDirectoryRecursively} from 'rimraf'
// endregion
await importFilesystemAPI()

export const PUBLIC_REPOSITORY_PATH =
    process.env.PUBLIC_REPOSITORY_PATH ||
    resolve('../', `${process.env.GIT_PRIVATE_AUTHOR_NAME || ''}.github.io`)

export const log =
    new Logger({name: 'website-utilities.deploy', level: 'info'})

const run = (command: string, options = {}): string =>
    execSync(command, {encoding: 'utf-8', shell: '/bin/bash', ...options})

if (!await isFile(resolve(PUBLIC_REPOSITORY_PATH, 'CNAME')))
    throw new Error(
        `Missing public website directory in "${PUBLIC_REPOSITORY_PATH}"`
    )

if (process.env.USER_NAME_GITHUB) {
    void log.info(`Set git user name to "${process.env.USER_NAME_GITHUB}".`)
    void log.info(run(
        `git config user.name '${process.env.USER_NAME_GITHUB}'`,
        {cwd: PUBLIC_REPOSITORY_PATH}
    ))
}
if (process.env.USER_EMAIL_GITHUB) {
    void log.info(`Set git user email to "${process.env.USER_EMAIL_GITHUB}".`)
    void log.info(run(
        `git config user.email '${process.env.USER_EMAIL_GITHUB}'`,
        {cwd: PUBLIC_REPOSITORY_PATH}
    ))
}
void log.info('Pull latest public website state.')
void log.info(run('git pull', {cwd: PUBLIC_REPOSITORY_PATH}))

void log.info('Build new web page.')
void log.info(run('yarn clear'))
void log.info(run('yarn build'))

void log.info(`Update page data in "${PUBLIC_REPOSITORY_PATH}".`)

await removeDirectoryRecursively(
    PUBLIC_REPOSITORY_PATH,
    {filter: (path) =>
        path !== PUBLIC_REPOSITORY_PATH &&
        ![
            resolve(PUBLIC_REPOSITORY_PATH, '.git'),
            resolve(PUBLIC_REPOSITORY_PATH, '.github'),
            resolve(PUBLIC_REPOSITORY_PATH, 'CNAME'),
            resolve(PUBLIC_REPOSITORY_PATH, 'readme.md'),
            resolve(PUBLIC_REPOSITORY_PATH, 'public-repository')
        ].some((ignorePath) => path.startsWith(ignorePath))
    }
)

await copyDirectoryRecursive('build', PUBLIC_REPOSITORY_PATH, true)

void log.info(run('yarn clear'))

void log.info('Upload newly build webpage')
void log.info(run(
    `git commit --all --message 'Automatic page build update.'`,
    {cwd: PUBLIC_REPOSITORY_PATH}
))
void log.info(run('git push', {cwd: PUBLIC_REPOSITORY_PATH}))
