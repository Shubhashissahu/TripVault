export const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200';
export const labelCls = 'flex flex-col gap-1 text-sm font-medium text-slate-700';
export const btnPrimary =
  'inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60';
export const btnSecondary =
  'inline-flex items-center justify-center rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60';
export const btnDanger =
  'inline-flex items-center justify-center rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100';
export const errorCls = 'rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200';
export const noticeCls = 'rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 ring-1 ring-amber-200';
export const authCardCls = 'mx-auto mt-16 w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200';

// Cloudinary delivery optimisation: resized, auto-format, auto-quality
export const cdn = (url, width = 600) =>
  url ? url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`) : '';