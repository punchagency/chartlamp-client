// form
import { FormProvider as Form, UseFormReturn } from 'react-hook-form';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: VoidFunction;
  preventAutoComplete?: boolean
};

export default function FormProvider({ children, onSubmit, methods, preventAutoComplete }: Props) {
  const extra = preventAutoComplete ? {
    autoComplete: "off"
  }: {};

  return (
    <Form {...methods}>
      <form onSubmit={onSubmit} {...extra}>{children}</form>
    </Form>
  );
}
