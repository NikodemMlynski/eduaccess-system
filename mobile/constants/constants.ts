import {API_URL, HOSTNAME, TOKEN_STORAGE_KEY } from "@env";

export const apiUrl = API_URL.replace("HOSTNAME", HOSTNAME);
export const tokenStorageKey = TOKEN_STORAGE_KEY;
