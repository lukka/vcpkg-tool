"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activation = void 0;
exports.deactivate = deactivate;
/* eslint-disable prefer-const */
const promises_1 = require("fs/promises");
const path_1 = require("path");
const yaml_1 = require("yaml");
const constants_1 = require("../constants");
const i18n_1 = require("../i18n");
const checks_1 = require("../util/checks");
const curly_replacements_1 = require("../util/curly-replacements");
const linq_1 = require("../util/linq");
const promise_1 = require("../util/promise");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const XMLWriterImpl = require('xml-writer');
function findCaseInsensitiveOnWindows(map, key) {
    return process.platform === 'win32' ? linq_1.linq.find(map, key) : map.get(key);
}
function displayNoPostScriptError(channels) {
    channels.error((0, i18n_1.i) `no postscript file: run vcpkg-shell with the same arguments`);
}
class Activation {
    allowStacking;
    channels;
    environment;
    postscriptFile;
    undoFile;
    nextUndoEnvironmentFile;
    #defines = new Map();
    #aliases = new Map();
    #environmentChanges = new Map();
    #properties = new Map();
    #msbuild_properties = new Array();
    // Relative to the artifact install
    #locations = new Map();
    #paths = new Map();
    #tools = new Map();
    constructor(allowStacking, channels, environment, postscriptFile, undoFile, nextUndoEnvironmentFile) {
        this.allowStacking = allowStacking;
        this.channels = channels;
        this.environment = environment;
        this.postscriptFile = postscriptFile;
        this.undoFile = undoFile;
        this.nextUndoEnvironmentFile = nextUndoEnvironmentFile;
    }
    static async start(session, allowStacking) {
        const environment = process.env;
        const postscriptFileName = environment[constants_1.postscriptVariable];
        const postscriptFile = postscriptFileName ? session.fileSystem.file(postscriptFileName) : undefined;
        const undoVariableValue = environment[constants_1.undoVariableName];
        const undoFileUri = undoVariableValue ? session.fileSystem.file(undoVariableValue) : undefined;
        const undoFileRaw = undoFileUri ? await undoFileUri.tryReadUTF8() : undefined;
        const undoFile = undoFileRaw ? JSON.parse(undoFileRaw) : undefined;
        const undoStack = undoFile?.stack;
        if (undoFile && !allowStacking) {
            if (undoStack) {
                printDeactivatingMessage(session.channels, undoStack);
                undoStack.length = 0;
            }
            if (undoFile.environment) {
                // form what the environment "would have been" had we deactivated first for figuring out
                // what the new environment should be
                undoActivation(environment, undoFile.environment);
            }
        }
        const nextUndoEnvironmentFile = session.nextPreviousEnvironment;
        return new Activation(allowStacking, session.channels, environment, postscriptFile, undoFile, nextUndoEnvironmentFile);
    }
    addExports(exports, targetFolder) {
        for (let [define, defineValue] of exports.defines) {
            if (!define) {
                continue;
            }
            if (defineValue === 'true') {
                defineValue = '1';
            }
            this.addDefine(define, defineValue);
        }
        // **** paths ****
        for (const [pathName, values] of exports.paths) {
            if (!pathName || !values || values.length === 0) {
                continue;
            }
            // the folder is relative to the artifact install
            for (const folder of values) {
                this.addPath(pathName, targetFolder.join(folder).fsPath);
            }
        }
        // **** tools ****
        for (let [toolName, toolPath] of exports.tools) {
            if (!toolName || !toolPath) {
                continue;
            }
            this.addTool(toolName, targetFolder.join(toolPath).fsPath);
        }
        // **** locations ****
        for (const [name, location] of exports.locations) {
            if (!name || !location) {
                continue;
            }
            this.addLocation(name, targetFolder.join(location).fsPath);
        }
        // **** variables ****
        for (const [name, environmentVariableValues] of exports.environment) {
            if (!name || environmentVariableValues.length === 0) {
                continue;
            }
            this.addEnvironmentVariable(name, environmentVariableValues);
        }
        // **** properties ****
        for (const [name, propertyValues] of exports.properties) {
            if (!name || propertyValues.length === 0) {
                continue;
            }
            this.addProperty(name, propertyValues);
        }
        // **** aliases ****
        for (const [name, alias] of exports.aliases) {
            if (!name || !alias) {
                continue;
            }
            this.addAlias(name, alias);
        }
        // **** msbuild-properties ****
        for (const [name, propertyValue] of exports.msbuild_properties) {
            this.addMSBuildProperty(name, propertyValue, targetFolder);
        }
    }
    /** a collection of #define declarations that would assumably be applied to all compiler calls. */
    addDefine(name, value) {
        const v = findCaseInsensitiveOnWindows(this.#defines, name);
        if (v === undefined) {
            this.#defines.set(name, value);
        }
        else if (v !== value) {
            // conflict. todo: what do we want to do?
            this.channels.warning((0, i18n_1.i) `Duplicate define ${name} during activation. New value will replace old.`);
            this.#defines.set(name, value);
        }
    }
    get defines() {
        return linq_1.linq.entries(this.#defines).selectAsync(async ([key, value]) => [key, await this.resolveAndVerify(value)]);
    }
    async getDefine(name) {
        const v = this.#defines.get(name);
        return v ? await this.resolveAndVerify(v) : undefined;
    }
    /** a collection of tool locations from artifacts */
    addTool(name, value) {
        const t = findCaseInsensitiveOnWindows(this.#tools, name);
        if (t === undefined) {
            this.#tools.set(name, value);
        }
        else if (t !== value) {
            this.channels.warning((0, i18n_1.i) `Duplicate tool declared ${name} during activation.  New value will replace old.`);
            this.#tools.set(name, value);
        }
    }
    get tools() {
        return linq_1.linq.entries(this.#tools).selectAsync(async ([key, value]) => [key, await this.resolveAndVerify(value)]);
    }
    async getTool(name) {
        const t = findCaseInsensitiveOnWindows(this.#tools, name);
        if (t) {
            const path = await this.resolveAndVerify(t);
            return await this.validatePath(path) ? path : undefined;
        }
        return undefined;
    }
    /** Aliases are tools that get exposed to the user as shell aliases */
    addAlias(name, value) {
        const a = findCaseInsensitiveOnWindows(this.#aliases, name);
        if (a === undefined) {
            this.#aliases.set(name, value);
        }
        else if (a !== value) {
            this.channels.warning((0, i18n_1.i) `Duplicate alias declared ${name} during activation.  New value will replace old.`);
            this.#aliases.set(name, value);
        }
    }
    async getAlias(name, refcheck = new Set()) {
        const v = findCaseInsensitiveOnWindows(this.#aliases, name);
        if (v !== undefined) {
            return this.resolveAndVerify(v, [], refcheck);
        }
        return undefined;
    }
    get aliases() {
        return linq_1.linq.entries(this.#aliases).selectAsync(async ([key, value]) => [key, await this.resolveAndVerify(value)]);
    }
    get aliasCount() {
        return this.#aliases.size;
    }
    /** a collection of 'published locations' from artifacts */
    addLocation(name, location) {
        if (!name || !location) {
            return;
        }
        location = typeof location === 'string' ? location : location.fsPath;
        const l = this.#locations.get(name);
        if (l === undefined) {
            this.#locations.set(name, location);
        }
        else if (l !== location) {
            this.channels.warning((0, i18n_1.i) `Duplicate location declared ${name} during activation. New value will replace old.`);
            this.#locations.set(name, location);
        }
    }
    get locations() {
        return linq_1.linq.entries(this.#locations).selectAsync(async ([key, value]) => [key, await this.resolveAndVerify(value)]);
    }
    getLocation(name) {
        const l = this.#locations.get(name);
        return l ? this.resolveAndVerify(l) : undefined;
    }
    /** a collection of environment variables from artifacts that are intended to be combinined into variables that have PATH delimiters */
    addPath(name, location) {
        if (!name || !location) {
            return;
        }
        let set = findCaseInsensitiveOnWindows(this.#paths, name);
        if (!set) {
            set = new Set();
            this.#paths.set(name, set);
        }
        if ((0, checks_1.isIterable)(location)) {
            for (const l of location) {
                set.add(typeof l === 'string' ? l : l.fsPath);
            }
        }
        else {
            set.add(typeof location === 'string' ? location : location.fsPath);
        }
    }
    get paths() {
        return linq_1.linq.entries(this.#paths).selectAsync(async ([key, value]) => [key, await this.resolveAndVerify(value)]);
    }
    async getPath(name) {
        const set = this.#paths.get(name);
        if (!set) {
            return undefined;
        }
        return this.resolveAndVerify(set);
    }
    /** environment variables from artifacts */
    addEnvironmentVariable(name, value) {
        if (!name) {
            return;
        }
        let v = findCaseInsensitiveOnWindows(this.#environmentChanges, name);
        if (!v) {
            v = new Set();
            this.#environmentChanges.set(name, v);
        }
        if (typeof value === 'string') {
            v.add(value);
        }
        else {
            for (const each of value) {
                v.add(each);
            }
        }
    }
    /** a collection of arbitrary properties from artifacts */
    addProperty(name, value) {
        if (!name) {
            return;
        }
        let v = this.#properties.get(name);
        if (v === undefined) {
            v = new Set();
            this.#properties.set(name, v);
        }
        if (typeof value === 'string') {
            v.add(value);
        }
        else {
            for (const each of value) {
                v.add(each);
            }
        }
    }
    get properties() {
        return linq_1.linq.entries(this.#properties).selectAsync(async ([key, value]) => [key, await this.resolveAndVerify(value)]);
    }
    async getProperty(name) {
        const v = this.#properties.get(name);
        return v ? await this.resolveAndVerify(v) : undefined;
    }
    msBuildProcessPropertyValue(value, targetFolder) {
        // note that this is intended to be consistent with vcpkg's handling:
        // include/vcpkg/base/api_stable_format.h
        const initialLocal = targetFolder.fsPath;
        const endsWithSlash = initialLocal.endsWith('\\') || initialLocal.endsWith('/');
        const root = endsWithSlash ? initialLocal.substring(0, initialLocal.length - 1) : initialLocal;
        const replacements = new Map([['root', root]]);
        return (0, curly_replacements_1.replaceCurlyBraces)(value, replacements);
    }
    addMSBuildProperty(name, value, targetFolder) {
        this.#msbuild_properties.push([name, this.msBuildProcessPropertyValue(value, targetFolder)]);
    }
    async resolveAndVerify(value, locals = [], refcheck = new Set()) {
        if (typeof value === 'string') {
            value = this.resolveVariables(value, locals, refcheck);
            if (value.indexOf('{') === -1) {
                return value;
            }
            const parts = value.split(/\{+(.+?)\}+/g);
            const result = [];
            for (let index = 0; index < parts.length; index += 2) {
                result.push(parts[index]);
                result.push(await this.validatePath(parts[index + 1]));
            }
            return result.join('');
        }
        // for sets
        const result = new Set();
        await new promise_1.Queue().enqueueMany(value, async (v) => result.add(await this.resolveAndVerify(v, locals))).done;
        return result;
    }
    resolveVariables(text, locals = [], refcheck = new Set()) {
        if ((0, yaml_1.isScalar)(text)) {
            this.channels.debug(`internal warning: scalar value being used directly : ${text.value}`);
            text = text.value; // spews a --debug warning if a scalar makes its way thru for some reason
        }
        // short-circuiting
        if (!text || text.indexOf('$') === -1) {
            return text;
        }
        // prevent circular resolution
        if (refcheck.has(text)) {
            this.channels.warning((0, i18n_1.i) `Circular variable reference detected: ${text}`);
            this.channels.debug((0, i18n_1.i) `Circular variable reference detected: ${text} - ${linq_1.linq.join(refcheck, ' -> ')}`);
            return text;
        }
        return text.replace(/(\$\$)|(\$)([a-zA-Z_][a-zA-Z0-9_]*)\.([a-zA-Z_][a-zA-Z0-9_]*)|(\$)([a-zA-Z_][a-zA-Z0-9_]*)/g, (wholeMatch, isDoubleDollar, isObjectMember, obj, member, isSimple, variable) => {
            return isDoubleDollar ? '$' : isObjectMember ? this.getValueForVariableSubstitution(obj, member, locals, refcheck) : this.resolveVariables(locals[variable], locals, refcheck);
        });
    }
    getValueForVariableSubstitution(obj, member, locals, refcheck) {
        switch (obj) {
            case 'environment': {
                // lookup environment variable value
                const v = findCaseInsensitiveOnWindows(this.#environmentChanges, member);
                if (v) {
                    return this.resolveVariables(linq_1.linq.join(v, ' '), [], refcheck);
                }
                // lookup the environment variable in the original environment
                const orig = this.environment[member];
                if (orig) {
                    return orig;
                }
                break;
            }
            case 'defines': {
                const v = findCaseInsensitiveOnWindows(this.#defines, member);
                if (v !== undefined) {
                    return this.resolveVariables(v, locals, refcheck);
                }
                break;
            }
            case 'aliases': {
                const v = findCaseInsensitiveOnWindows(this.#aliases, member);
                if (v !== undefined) {
                    return this.resolveVariables(v, locals, refcheck);
                }
                break;
            }
            case 'locations': {
                const v = findCaseInsensitiveOnWindows(this.#locations, member);
                if (v !== undefined) {
                    return this.resolveVariables(v, locals, refcheck);
                }
                break;
            }
            case 'paths': {
                const v = findCaseInsensitiveOnWindows(this.#paths, member);
                if (v !== undefined) {
                    return this.resolveVariables(linq_1.linq.join(v, path_1.delimiter), locals, refcheck);
                }
                break;
            }
            case 'properties': {
                const v = findCaseInsensitiveOnWindows(this.#properties, member);
                if (v !== undefined) {
                    return this.resolveVariables(linq_1.linq.join(v, ';'), locals, refcheck);
                }
                break;
            }
            case 'tools': {
                const v = findCaseInsensitiveOnWindows(this.#tools, member);
                if (v !== undefined) {
                    return this.resolveVariables(v, locals, refcheck);
                }
                break;
            }
            default:
                this.channels.warning((0, i18n_1.i) `Variable reference found '$${obj}.${member}' that is referencing an unknown base object.`);
                return `$${obj}.${member}`;
        }
        this.channels.debug((0, i18n_1.i) `Unresolved variable reference found ($${obj}.${member}) during variable substitution.`);
        return `$${obj}.${member}`;
    }
    async validatePath(path) {
        if (path) {
            try {
                if (path[0] === '"') {
                    path = path.substr(1, path.length - 2);
                }
                path = (0, path_1.resolve)(path);
                await (0, promises_1.lstat)(path);
                // if the path has spaces, we need to quote it
                if (path.indexOf(' ') !== -1) {
                    path = `"${path}"`;
                }
                return path;
            }
            catch {
                // does not exist
                this.channels.error((0, i18n_1.i) `Invalid path - does not exist: ${path}`);
            }
        }
        return '';
    }
    expandPathLikeVariableExpressions(value) {
        let n = undefined;
        const parts = value.split(/(\$[a-zA-Z0-9_.]+)/g).filter(each => each).map((part, i) => {
            const value = this.resolveVariables(part).replace(/\{(.*?)\}/g, (match, expression) => expression);
            if (value.indexOf(path_1.delimiter) !== -1) {
                n = i;
            }
            return value;
        });
        if (n === undefined) {
            // if the value didn't have a path separator, then just return the value
            return [parts.join('')];
        }
        const front = parts.slice(0, n).join('');
        const back = parts.slice(n + 1).join('');
        return parts[n].split(path_1.delimiter).filter(each => each).map(each => `${front}${each}${back}`);
    }
    generateMSBuild() {
        const result = new XMLWriterImpl('  ');
        result.startDocument('1.0', 'utf-8');
        result.startElement('Project');
        result.writeAttribute('xmlns', 'http://schemas.microsoft.com/developer/msbuild/2003');
        if (this.#msbuild_properties.length) {
            result.startElement('PropertyGroup');
            for (const [key, value] of this.#msbuild_properties) {
                result.writeElement(key, value);
            }
            result.endElement(); // PropertyGroup
        }
        result.endElement(); // Project
        return result.toString();
    }
    async generateEnvironmentVariables() {
        const undo = {};
        const env = {};
        for await (const [pathVariable, locations] of this.paths) {
            if (locations.size) {
                const originalVariable = linq_1.linq.find(this.environment, pathVariable) || '';
                if (originalVariable) {
                    for (const p of originalVariable.split(path_1.delimiter)) {
                        if (p) {
                            locations.add(p);
                        }
                    }
                }
                // compose the final value
                env[pathVariable] = linq_1.linq.join(locations, path_1.delimiter);
                // set the undo data
                undo[pathVariable] = originalVariable || '';
            }
        }
        // combine environment variables with multiple values with spaces (uses: CFLAGS, etc)
        const environmentVariables = linq_1.linq.entries(this.#environmentChanges)
            .selectAsync(async ([key, value]) => [key, await this.resolveAndVerify(value)]);
        for await (const [variable, values] of environmentVariables) {
            env[variable] = linq_1.linq.join(values, ' ');
            undo[variable] = this.environment[variable] || '';
        }
        // .tools get defined as environment variables too.
        for await (const [variable, value] of this.tools) {
            env[variable] = value;
            undo[variable] = this.environment[variable] || '';
        }
        // .defines get compiled into a single environment variable.
        let defines = '';
        for await (const [name, value] of this.defines) {
            defines += value ? `-D${name}=${value} ` : `-D${name} `;
        }
        if (defines) {
            env['DEFINES'] = defines;
            undo['DEFINES'] = this.environment['DEFINES'] || '';
        }
        return [env, undo];
    }
    async activate(thisStackEntries, msbuildFile, json) {
        const postscriptFile = this.postscriptFile;
        if (!postscriptFile && !msbuildFile && !json) {
            displayNoPostScriptError(this.channels);
            return false;
        }
        async function transformtoRecord(orig, 
        // this type cast to U isn't *technically* correct but since it's locally scoped for this next block of code it shouldn't cause problems
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        func = (x => x)) {
            return linq_1.linq.values((await toArrayAsync(orig))).toObject(tuple => [tuple[0], func(tuple[1])]);
        }
        const defines = await transformtoRecord(this.defines);
        const aliases = await transformtoRecord(this.aliases);
        const locations = await transformtoRecord(this.locations);
        const tools = await transformtoRecord(this.tools);
        const properties = await transformtoRecord(this.properties, (set) => Array.from(set));
        const paths = await transformtoRecord(this.paths, (set) => Array.from(set));
        const [variables, undo] = await this.generateEnvironmentVariables();
        // msbuildFile and json are always generated as if deactivation happend first so that their
        // content does not depend on the stacked environment.
        if (msbuildFile) {
            const contents = await this.generateMSBuild();
            this.channels.debug(`--------[START MSBUILD FILE]--------\n${contents}\n--------[END MSBUILD FILE]---------`);
            await msbuildFile.writeUTF8(contents);
        }
        if (json) {
            const contents = generateJson(variables, defines, aliases, properties, locations, paths, tools);
            this.channels.debug(`--------[START ENV VAR FILE]--------\n${contents}\n--------[END ENV VAR FILE]---------`);
            await json.writeUTF8(contents);
        }
        const newUndoStack = this.undoFile?.stack ?? [];
        Array.prototype.push.apply(newUndoStack, thisStackEntries);
        this.channels.message((0, i18n_1.i) `Activating: ${newUndoStack.join(' + ')}`);
        if (postscriptFile) {
            // preserve undo environment variables for anything this particular activation did not touch
            const oldEnvironment = this.undoFile?.environment;
            if (oldEnvironment) {
                for (const oldUndoKey in oldEnvironment) {
                    undo[oldUndoKey] = oldEnvironment[oldUndoKey] ?? '';
                    if (!this.allowStacking && variables[oldUndoKey] === undefined) {
                        variables[oldUndoKey] = '';
                    }
                }
            }
            if (!variables[constants_1.undoVariableName]) {
                variables[constants_1.undoVariableName] = this.nextUndoEnvironmentFile.fsPath;
            }
            // if any aliases were undone, remove them
            const oldAliases = this.undoFile?.aliases;
            if (oldAliases) {
                for (const oldAlias in oldAliases) {
                    if (aliases[oldAlias] === undefined) {
                        aliases[oldAlias] = '';
                    }
                }
            }
            // generate shell script
            await writePostscript(this.channels, postscriptFile, variables, aliases);
            const nonEmptyAliases = [];
            for (const alias in aliases) {
                if (aliases[alias]) {
                    nonEmptyAliases.push(alias);
                }
            }
            const undoContents = {
                environment: undo,
                aliases: nonEmptyAliases,
                stack: newUndoStack
            };
            const undoStringified = JSON.stringify(undoContents);
            this.channels.debug(`--------[START UNDO FILE]--------\n${undoStringified}\n--------[END UNDO FILE]---------`);
            await this.nextUndoEnvironmentFile.writeUTF8(undoStringified);
        }
        return true;
    }
}
exports.Activation = Activation;
function generateCmdScript(variables, aliases) {
    return linq_1.linq.entries(variables).select(([k, v]) => { return v ? `set ${k}=${v}` : `set ${k}=`; }).join('\r\n') +
        '\r\n' +
        linq_1.linq.entries(aliases).select(([k, v]) => { return v ? `doskey ${k}=${v} $*` : `doskey ${k}=`; }).join('\r\n') +
        '\r\n';
}
function generatePowerShellScript(variables, aliases) {
    return linq_1.linq.entries(variables).select(([k, v]) => { return v ? `$\{ENV:${k}}="${v}"` : `$\{ENV:${k}}=$null`; }).join('\n') +
        '\n' +
        linq_1.linq.entries(aliases).select(([k, v]) => { return v ? `function global:${k} { & ${v} @args }` : `remove-item -ea 0 "function:${k}"`; }).join('\n') +
        '\n';
}
function generatePosixScript(variables, aliases) {
    return linq_1.linq.entries(variables).select(([k, v]) => { return v ? `export ${k}="${v}"` : `unset ${k}`; }).join('\n') +
        '\n' +
        linq_1.linq.entries(aliases).select(([k, v]) => { return v ? `${k}() {\n  ${v} $* \n}` : `unset -f ${v} > /dev/null 2>&1`; }).join('\n') +
        '\n';
}
function generateScriptContent(kind, variables, aliases) {
    switch (kind) {
        case '.ps1':
            return generatePowerShellScript(variables, aliases);
        case '.cmd':
            return generateCmdScript(variables, aliases);
        case '.sh':
            return generatePosixScript(variables, aliases);
    }
    return '';
}
async function writePostscript(channels, postscriptFile, variables, aliases) {
    const contents = generateScriptContent((0, path_1.extname)(postscriptFile.fsPath), variables, aliases);
    channels.debug(`--------[START SHELL SCRIPT FILE]--------\n${contents}\n--------[END SHELL SCRIPT FILE]---------`);
    channels.debug(`Postscript file ${postscriptFile}`);
    await postscriptFile.writeUTF8(contents);
}
function generateJson(variables, defines, aliases, properties, locations, paths, tools) {
    let contents = {
        'version': 1,
        variables,
        defines,
        aliases,
        properties,
        locations,
        paths,
        tools
    };
    return JSON.stringify(contents);
}
function printDeactivatingMessage(channels, stack) {
    channels.message((0, i18n_1.i) `Deactivating: ${stack.join(' + ')}`);
}
async function deactivate(session, warnIfNoActivation) {
    const undoVariableValue = process.env[constants_1.undoVariableName];
    if (!undoVariableValue) {
        if (warnIfNoActivation) {
            session.channels.warning((0, i18n_1.i) `nothing is activated, no changes have been made`);
        }
        return true;
    }
    const postscriptFileName = process.env[constants_1.postscriptVariable];
    if (!postscriptFileName) {
        displayNoPostScriptError(session.channels);
        return false;
    }
    const postscriptFile = session.fileSystem.file(postscriptFileName);
    const undoFileUri = session.fileSystem.file(undoVariableValue);
    const undoFileRaw = await undoFileUri.tryReadUTF8();
    if (undoFileRaw) {
        const undoFile = JSON.parse(undoFileRaw);
        const deactivationStack = undoFile.stack;
        if (deactivationStack) {
            printDeactivatingMessage(session.channels, deactivationStack);
        }
        const deactivationEnvironment = { ...undoFile.environment };
        deactivationEnvironment[constants_1.undoVariableName] = '';
        const deactivateAliases = {};
        const aliases = undoFile.aliases;
        if (aliases) {
            for (const alias of aliases) {
                deactivateAliases[alias] = '';
            }
        }
        await writePostscript(session.channels, postscriptFile, deactivationEnvironment, deactivateAliases);
        await undoFileUri.delete();
    }
    return true;
}
// replace all values in target with those in source
function undoActivation(target, source) {
    for (const key in source) {
        const value = source[key];
        if (value) {
            target[key] = value;
        }
        else {
            delete target[key];
        }
    }
}
async function toArrayAsync(iterable) {
    const result = [];
    for await (const item of iterable) {
        result.push(item);
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aXZhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJhcnRpZmFjdHMvYWN0aXZhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBaXZCbEMsZ0NBMENDO0FBenhCRCxpQ0FBaUM7QUFFakMsMENBQW9DO0FBQ3BDLCtCQUFtRDtBQUNuRCwrQkFBZ0M7QUFDaEMsNENBQW9FO0FBQ3BFLGtDQUE0QjtBQUk1QiwyQ0FBNEM7QUFDNUMsbUVBQWdFO0FBQ2hFLHVDQUFvQztBQUNwQyw2Q0FBd0M7QUFFeEMsOERBQThEO0FBQzlELE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQWdCNUMsU0FBUyw0QkFBNEIsQ0FBSSxHQUFtQixFQUFFLEdBQVc7SUFDdkUsT0FBTyxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsV0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0UsQ0FBQztBQUdELFNBQVMsd0JBQXdCLENBQUMsUUFBa0I7SUFDbEQsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFBLFFBQUMsRUFBQSw2REFBNkQsQ0FBQyxDQUFDO0FBQ2pGLENBQUM7QUFFRCxNQUFhLFVBQVU7SUFhRjtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFqQm5CLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztJQUNyQyxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7SUFDckMsbUJBQW1CLEdBQUcsSUFBSSxHQUFHLEVBQXVCLENBQUM7SUFDckQsV0FBVyxHQUFHLElBQUksR0FBRyxFQUF1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