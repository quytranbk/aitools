import { invokeFactory } from './nativeFactory';

const nutjsService = invokeFactory('nutjs', [
    'type',
    'configAutoDelayMs',
    'pressKey',
    'releaseKey',
]);
export default nutjsService;