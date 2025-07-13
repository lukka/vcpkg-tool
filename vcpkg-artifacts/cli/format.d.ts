import { Uri } from '../util/uri';
export declare function projectFile(uri: Uri): string;
export declare function prettyRegistryName(registryName: string): string;
export declare function artifactIdentity(registryName: string, identity: string, shortName: string): string;
export declare function addVersionToArtifactIdentity(identity: string, version: string): string;
export declare function heading(text: string, level?: number): string;
export declare function optional(text: string): any;
export declare function cmdSwitch(text: string): any;
export declare function command(text: string): any;
export declare function hint(text: string): any;
export declare function count(num: number): any;
export declare function position(text: string): any;
//# sourceMappingURL=format.d.ts.map