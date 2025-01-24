import { pxToRem } from '../theme';
import { CustomImage } from './CustomImage';


export default function ClockFace() {
  return (
    <CustomImage
      src="/images/clock-thin-outline-svgrepo-com.svg"
      wrapperSx={{
        // height: pxToRem(40),
        width: pxToRem(182),
      }}
    />
  );
}