import { invokeFactory } from './nativeFactory';

const dialogService = invokeFactory('dialog', [
    'showOpenDialogSync',
    'showOpenDialog',
    'showSaveDialogSync',
    'showSaveDialog',
    'showMessageBoxSync',
    'showMessageBox',
    'showErrorBox',
    'showCertificateTrustDialog',
]);
export default dialogService;