import { invokeFactory } from './nativeFactory';

const dialogService = invokeFactory('dialog', [
    'showOpenDialogSync',
    'showOpenDialog',
    'showSaveDialog',
    'showMessageBoxSync',
    'showMessageBox',
    'showErrorBox',
    'showCertificateTrustDialog',
]);
export default dialogService;