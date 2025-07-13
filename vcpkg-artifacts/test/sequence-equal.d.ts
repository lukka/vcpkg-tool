declare module 'assert' {
    namespace assert {
        function sequenceEqual(actual: Iterable<any> | undefined, expected: Iterable<any>, message?: string | Error): void;
        function throws(block: () => any, message?: string | Error): void;
    }
}
export {};
//# sourceMappingURL=sequence-equal.d.ts.map