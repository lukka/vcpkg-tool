import { LocalFileSystem } from '../../fs/local-filesystem';
import { Session } from '../../session';
import { Uri } from '../../util/uri';
export declare class SuiteLocal {
    readonly tempFolder: string;
    readonly session: Session;
    readonly fs: LocalFileSystem;
    readonly resourcesFolder: string;
    readonly tempFolderUri: Uri;
    readonly resourcesFolderUri: Uri;
    constructor();
    after(): Promise<void>;
    static log(args: any): void;
}
//# sourceMappingURL=SuiteLocal.d.ts.map