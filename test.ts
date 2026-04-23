// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
'use strict'
/* !
    region header
    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import {beforeAll, describe, expect, test} from '@jest/globals'
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter'

import WebsiteUtilities, {api} from './index'
// endregion
describe('root', (): void => {
    let root: WebsiteUtilities

    beforeAll(async () => {
        api.register()
        root = document.createElement('web-internationalization') as
            WebsiteUtilities
        document.body.appendChild(root)

        await root.rendered
    })
    // region tests
    test('should be defined', () => {
        expect(root).toBeDefined()
    })
    // endregion
})
