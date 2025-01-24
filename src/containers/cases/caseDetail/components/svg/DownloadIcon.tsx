import { pxToRem } from '@/theme';

export function DownloadIcon() {
  return (
    <svg
      width={pxToRem(24)}
      height={pxToRem(24)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 17V3"
        stroke="#677D7C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 21H4"
        stroke="#677D7C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 12L11.999 17.001L6.99902 12"
        stroke="#677D7C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
