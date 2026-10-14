/**
 * Formatters and Helper Utilities for WISUDA STIBHA 2026 Finance App
 */
import * as XLSX from 'xlsx';

export const formatRupiah = (amount: number | string | undefined | null): string => {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return 'Rp0';
  }
  const numeric = Math.round(Number(amount));
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numeric).replace(/\s+/g, '');
};

export const parseRupiahInput = (value: string): number => {
  const clean = value.replace(/[^0-9]/g, '');
  return clean ? parseInt(clean, 10) : 0;
};

export const terbilangRupiah = (nominal: number | string | undefined | null): string => {
  if (nominal === undefined || nominal === null || isNaN(Number(nominal))) return 'Nol Rupiah';
  const angka = Math.round(Math.abs(Number(nominal)));
  if (angka === 0) return 'Nol Rupiah';
  const huruf = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];

  const toWords = (n: number): string => {
    if (n < 12) return huruf[n];
    if (n < 20) return `${huruf[n - 10]} Belas`;
    if (n < 100) return `${huruf[Math.floor(n / 10)]} Puluh ${huruf[n % 10]}`.trim();
    if (n < 200) return `Seratus ${toWords(n - 100)}`.trim();
    if (n < 1000) return `${huruf[Math.floor(n / 100)]} Ratus ${toWords(n % 100)}`.trim();
    if (n < 2000) return `Seribu ${toWords(n - 1000)}`.trim();
    if (n < 1000000) return `${toWords(Math.floor(n / 1000))} Ribu ${toWords(n % 1000)}`.trim();
    if (n < 1000000000) return `${toWords(Math.floor(n / 1000000))} Juta ${toWords(n % 1000000)}`.trim();
    if (n < 1000000000000) return `${toWords(Math.floor(n / 1000000000))} Miliar ${toWords(n % 1000000000)}`.trim();
    return `${toWords(Math.floor(n / 1000000000000))} Triliun ${toWords(n % 1000000000000)}`.trim();
  };

  return `${toWords(angka)} Rupiah`;
};

export const formatDateIndo = (dateStr: string | undefined | null): string => {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
};

export const formatDateTimeIndo = (dateTimeStr: string | undefined | null): string => {
  if (!dateTimeStr) return '-';
  try {
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) return dateTimeStr;
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateTimeStr;
  }
};

export const generateTransactionNo = (prefix: 'IN' | 'OUT' | 'EXP' | 'REQ'): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}${month}${day}-${randomSuffix}`;
};

export const generateStoragePath = (
  sieCode: string,
  txNo: string,
  fileName: string
): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const cleanSie = sieCode.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const cleanFile = fileName.toLowerCase().replace(/[^a-z0-9.]/g, '-');
  return `bukti-transaksi/${year}/${month}/${cleanSie}/${txNo}/${cleanFile}`;
};

export const exportToExcelXLSX = (
  fileName: string,
  headers: string[],
  rows: (string | number)[][],
  sheetName = 'Laporan'
) => {
  const data = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToCSV = (
  fileName: string,
  headers: string[],
  rows: (string | number)[][]
) => {
  const csvContent = [
    headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','),
    ...rows.map((row) =>
      row
        .map((cell) => {
          const val = cell !== undefined && cell !== null ? String(cell) : '';
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(',')
    ),
  ].join('\r\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
