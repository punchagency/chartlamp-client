import { pxToRem } from '../theme';
import { CustomImage } from './CustomImage';


export default function LogoBlack() {
  return (
    <CustomImage
      src="/images/LogoBlack.svg"
      wrapperSx={{
        height: pxToRem(40),
        width: pxToRem(182),
      }}
    />
  );
}