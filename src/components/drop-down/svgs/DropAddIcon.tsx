import { pxToRem } from "@/theme";

export function DropAddIcon() {
  return (
    <svg
      width={pxToRem(48)}
      height={pxToRem(48)}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="12" fill="#F0F8F8" />
      <path
        d="M30 24.75H18C17.59 24.75 17.25 24.41 17.25 24C17.25 23.59 17.59 23.25 18 23.25H30C30.41 23.25 30.75 23.59 30.75 24C30.75 24.41 30.41 24.75 30 24.75Z"
        fill="#677D7C"
      />
      <path
        d="M24 30.75C23.59 30.75 23.25 30.41 23.25 30V18C23.25 17.59 23.59 17.25 24 17.25C24.41 17.25 24.75 17.59 24.75 18V30C24.75 30.41 24.41 30.75 24 30.75Z"
        fill="#677D7C"
      />
    </svg>
  );
}
