/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPPORT_PHONE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
