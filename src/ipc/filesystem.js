import { invokeFactory } from './nativeFactory';

const fileSystemService = invokeFactory('filesystem', [
    'readFile',
    'readdir',
    'isFile',
]);
export default fileSystemService;