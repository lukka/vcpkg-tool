"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalRegistry = void 0;
const assert_1 = require("assert");
const crypto_1 = require("crypto");
const yaml_1 = require("yaml");
const constants_1 = require("../constants");
const ArtifactRegistry_1 = require("./ArtifactRegistry");
class LocalRegistry extends ArtifactRegistry_1.ArtifactRegistry {
    indexYaml;
    installationFolder;
    cacheFolder;
    constructor(session, location) {
        assert_1.strict.ok(location.scheme === 'file', `local registry location must be a file uri (${location})`);
        super(session, location);
        this.cacheFolder = location;
        this.indexYaml = this.cacheFolder.join(constants_1.registryIndexFile);
        this.installationFolder = session.installFolder.join(this.localName);
    }
    update(displayName) {
        return this.regenerate();
    }
    async load(force) {
        if (force || !this.loaded) {
            if (!await this.indexYaml.exists()) {
                // generate an index from scratch
                await this.regenerate();
                this.loaded = true;
                return;
            }
            this.session.channels.debug(`Loading registry from '${this.indexYaml.fsPath}'`);
            this.index.deserialize((0, yaml_1.parse)(await this.indexYaml.readUTF8()));
            this.loaded = true;
        }
    }
    get localName() {
        // We use this to generate the subdirectory that we install artifacts into.
        // It's not reqired to be very unique, but we'll generate it based of the path of the local location.
        return (0, crypto_1.createHash)('sha256').update(this.location.fsPath, 'utf8').digest('hex').substring(0, 8);
    }
}
exports.LocalRegistry = LocalRegistry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9jYWxSZWdpc3RyeS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJyZWdpc3RyaWVzL0xvY2FsUmVnaXN0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7OztBQUVsQyxtQ0FBZ0M7QUFDaEMsbUNBQW9DO0FBQ3BDLCtCQUE2QjtBQUM3Qiw0Q0FBaUQ7QUFHakQseURBQXNEO0FBR3RELE1BQWEsYUFBYyxTQUFRLG1DQUFnQjtJQUN2QyxTQUFTLENBQU07SUFDaEIsa0JBQWtCLENBQUM7SUFDbkIsV0FBVyxDQUFNO0lBRTFCLFlBQVksT0FBZ0IsRUFBRSxRQUFhO1FBQ3pDLGVBQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxNQUFNLEVBQUUsK0NBQStDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFFbEcsS0FBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQztRQUM1QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLDZCQUFpQixDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRUQsTUFBTSxDQUFDLFdBQW9CO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFUSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQWU7UUFDakMsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDMUIsSUFBSSxDQUFFLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDO2dCQUNwQyxpQ0FBaUM7Z0JBQ2pDLE1BQU0sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztnQkFDbkIsT0FBTztZQUNULENBQUM7WUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsMEJBQTBCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNoRixJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFBLFlBQUssRUFBQyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQy9ELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLENBQUM7SUFDSCxDQUFDO0lBRUQsSUFBWSxTQUFTO1FBQ25CLDJFQUEyRTtRQUMzRSxxR0FBcUc7UUFDckcsT0FBTyxJQUFBLG1CQUFVLEVBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2pHLENBQUM7Q0FDRjtBQXJDRCxzQ0FxQ0MifQ==