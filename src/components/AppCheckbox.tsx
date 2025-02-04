import CheckboxIconChecked from "./svgs/CheckboxIconChecked";
import CheckboxIconUnchecked from "./svgs/CheckboxIconUnchecked";

export default function AppCheckbox({
  isChecked = false,
}: {
  isChecked?: boolean;
}) {
  return isChecked ? <CheckboxIconChecked /> : <CheckboxIconUnchecked />;
}
