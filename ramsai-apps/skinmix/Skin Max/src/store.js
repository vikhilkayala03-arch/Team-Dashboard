import {products} from './catalog.js';
import {sanitizeState} from './core.js';
export const STORAGE_KEY='skinmix-v1';
export function loadState(){try{return sanitizeState(JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}'),products);}catch{return sanitizeState({},products);}}
export function persistState(state){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));return true;}catch{return false;}}
