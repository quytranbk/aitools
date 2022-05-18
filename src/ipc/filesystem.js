import { invokeFactory } from './nativeFactory';

const fileSystemService = invokeFactory('filesystem', [
    'readFile',
    'readdir',
    'isFile',
    'writeFile',
]);
export default fileSystemService;