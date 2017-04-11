export declare class SharedStylesHost {
    _styles: string[];
    _stylesSet: Set<string>;
    constructor();
    addStyles(styles: string[]): void;
    onStylesAdded(additions: string[]): void;
    getAllStyles(): string[];
}
export declare class NodeSharedStylesHost extends SharedStylesHost {
    _hostNodes: Set<Node>;
    constructor();
    addHost(hostNode: Node): void;
    removeHost(hostNode: Node): void;
    onStylesAdded(additions: string[]): void;
    private _addStylesToHost(styles, host);
}