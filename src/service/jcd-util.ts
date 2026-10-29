import { config } from '../lib/config';
import { JcdImage } from '../lib/models/jcd/jcd-image';

const month_names = [
  'January',
  'Februrary',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const jcdUtil = {
  getDisplayDate: getDisplayDate,
  getImageUrl: getImageUrl,
} as const;

function getDisplayDate(monthVal: number): typeof month_names[number] | undefined {
  return month_names[monthVal - 1];
}

function getImageUrl(env: string, jcdImg: JcdImage, sz?: string): string {
  let usp = new URLSearchParams({ env: env });
  if(sz !== undefined && sz.length > 0) {
    usp.append('sz', sz);
  }
  let url = `${config.EZD_API_BASE_URL}/v1/jcd/img/${jcdImg.bucketFile}?${usp.toString()}`;
  return url;
}
