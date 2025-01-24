import { pxToRem } from '@/theme';
import React from 'react'

export function SortIcon() {
  return (
    <svg
      width={pxToRem(21)}
      height={pxToRem(20)}
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.5996 6.81665H10.408H5.73296C4.93296 6.81665 4.53296 7.78332 5.09963 8.34998L9.41629 12.6667C10.108 13.3583 11.233 13.3583 11.9246 12.6667L13.5663 11.025L16.2413 8.34998C16.7996 7.78332 16.3996 6.81665 15.5996 6.81665Z"
        fill="#292D32"
      />
    </svg>
  );
}
