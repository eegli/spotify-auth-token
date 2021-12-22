/// <reference types="node" />
import { RequestOptions } from 'https';
export declare const getLocalhostUrl: (port: number) => Promise<string>;
export declare function request<T>(opts: RequestOptions, body: string): Promise<T>;
