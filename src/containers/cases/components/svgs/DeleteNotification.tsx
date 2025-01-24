import { pxToRem } from "@/theme";

export function DeleteNotification() {
  return (
    <svg
      width={pxToRem(41)}
      height={pxToRem(40)}
      viewBox="0 0 41 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" width="40" height="40" rx="12" fill="#FAD9D9" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.5 11C25.471 11 29.5 15.029 29.5 20C29.5 24.971 25.471 29 20.5 29C15.529 29 11.5 24.971 11.5 20C11.5 15.029 15.529 11 20.5 11Z"
        fill="#EB6969"
        stroke="#EB6969"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.5 20.5V15.5"
        stroke="#FAD9D9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.499 24C20.361 24 20.249 24.112 20.25 24.25C20.25 24.388 20.362 24.5 20.5 24.5C20.638 24.5 20.75 24.388 20.75 24.25C20.75 24.112 20.638 24 20.499 24"
        stroke="#FAD9D9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
