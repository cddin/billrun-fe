export const SHOW_PROGRESS_BAR = 'SHOW_PROGRESS_BAR';
export const HIDE_PROGRESS_BAR = 'HIDE_PROGRESS_BAR';

export function showProgressBar(){
  return { type: SHOW_PROGRESS_BAR }
}

export function hideProgressBar(){
  return { type: HIDE_PROGRESS_BAR }
}
