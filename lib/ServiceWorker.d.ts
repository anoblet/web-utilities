export declare const install: ({ source }: {
    source: string;
}) => void;
export declare const registerServiceWorker: ({ installed, message, source, }: {
    installed?: (event: any) => any;
    message?: (event: any) => any;
    source: string;
}) => void;
export declare const showUpdateSnackbar: () => Promise<void>;
export declare class ServiceWorker {
    private installedCallback;
    private local;
    private messageCallback;
    private source;
    constructor(properties: {
        source: string;
    });
    register(): void;
}
