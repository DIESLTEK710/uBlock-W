/*******************************************************************************

    uBlock Origin Lite - a comprehensive, MV3-compliant content blocker
    Copyright (C) 2022-present Raymond Hill

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    Home: https://github.com/gorhill/uBlock
*/

import {
    localRead, localWrite,
    sessionRead, sessionWrite,
} from './ext.js';

import { defaultRulesetsFromLanguage } from './ruleset-manager.js';

/******************************************************************************/

export const rulesetConfig = {
    version: '',
    enabledRulesets: [ 'default' ],
    autoReload: true,
    showBlockedCount: true,
};

export const process = {
    firstRun: false,
    wakeupRun: false,
};

/******************************************************************************/

export async function loadRulesetConfig() {
    const sessionData = await sessionRead('rulesetConfig');
    if ( sessionData ) {
        rulesetConfig.version = sessionData.version;
        rulesetConfig.enabledRulesets = sessionData.enabledRulesets;
        rulesetConfig.autoReload = typeof sessionData.autoReload === 'boolean'
            ? sessionData.autoReload
            : true;
        rulesetConfig.showBlockedCount = typeof sessionData.showBlockedCount === 'boolean'
            ? sessionData.showBlockedCount
            : true;
        process.wakeupRun = true;
        return;
    }
    const localData = await localRead('rulesetConfig');
    if ( localData ) {
        rulesetConfig.version = localData.version;
        rulesetConfig.enabledRulesets = localData.enabledRulesets;
        rulesetConfig.autoReload = typeof localData.autoReload === 'boolean'
            ? localData.autoReload
            : true;
        rulesetConfig.showBlockedCount = typeof localData.showBlockedCount === 'boolean'
            ? localData.showBlockedCount
            : true;
        sessionWrite('rulesetConfig', rulesetConfig);
        return;
    }
    rulesetConfig.enabledRulesets = await defaultRulesetsFromLanguage();
    sessionWrite('rulesetConfig', rulesetConfig);
    localWrite('rulesetConfig', rulesetConfig);
    process.firstRun = true;
}

export async function saveRulesetConfig() {
    sessionWrite('rulesetConfig', rulesetConfig);
    return localWrite('rulesetConfig', rulesetConfig);
}
