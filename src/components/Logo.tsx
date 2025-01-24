import { pxToRem } from '../theme';
import { CustomImage } from './CustomImage';


export default function Logo() {
  return (
    <CustomImage
      src="/images/logo.svg"
      wrapperSx={{
        height: pxToRem(53),
        width: pxToRem(176),
      }}
    />
  );
}