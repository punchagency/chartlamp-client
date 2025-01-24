import { pxToRem } from '@/theme';

export  function RetryIcon() {
  return (
    <svg
      width={pxToRem(24)}
      height={pxToRem(24)}
      viewBox="0 0 24 24"
      fill="none"
      style={{ cursor: "pointer" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.99658 5.49728V8.49853H5.99783"
        stroke="#788585"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.05518 13.0004C3.56417 17.4948 7.33228 20.9116 11.8548 20.9797C16.3774 21.0478 20.2467 17.7461 20.8909 13.2691C21.535 8.79215 18.7535 4.53346 14.3952 3.3238C10.0369 2.11413 5.45835 4.33001 3.70292 8.49854"
        stroke="#788585"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
