/** Upload rules + demo files for the shared UploadModal. Sample data from the approved prototype — replace with API. */
export const ACCEPTED_UPLOAD_EXT = ['pdf', 'jpg', 'jpeg', 'png', 'tif', 'tiff', 'heic', 'xlsx', 'xls', 'csv', 'docx'];
export const uploadSampleFiles = (duplicateName: string) => [
  { name: 'Timesheet_Ruiz_PayPeriod_02.pdf', size: 1258291 },
  { name: duplicateName, size: 1218000 },
  { name: 'FieldPhoto_MalibuCyn_PM4.8_Jan11.jpg', size: 3145728 },
  { name: 'crew_photos_jan.zip', size: 24117248 },
];
