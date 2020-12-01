export declare const registerServiceWorker: ({ installed, message, source, }: {
    installed?: (event: any) => any;
    message?: (event: any) => any;
    source: string;
}) => void;
export declare const showUpdateSnackbar: () => Promise<void>;
