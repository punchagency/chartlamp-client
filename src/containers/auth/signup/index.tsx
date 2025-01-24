"use client";
import { useAuthContext } from '@/auth/useAuthContext';
import { Button } from '@/components/Button';
import { RHFTextField } from '@/components/hook-form';
import FormProvider from '@/components/hook-form/FormProvider';
import LogoBlack from '@/components/LogoBlack';
import StepDots from '@/components/stepper/StepDots';
import { pxToRem, SECONDARY } from '@/theme';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, IconButton, InputAdornment, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { BackIcon } from '../components/svgs/BackIcon';
import { Visibility } from '../components/svgs/Visibility';
import { VisibilityOff } from '../components/svgs/VisibilityOff';

type FormValuesProps = {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
  organization?: string;
  [key: string]: string | undefined;
};

export default function SignUp() {
  const { register, error, isLoading, signUpComplete } = useAuthContext();
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState<FormValuesProps>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    organization: ''
  });


  const defaultValues = {
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    organization: ''
  };


  const SignupSchema = Yup.object().shape({
    email: Yup.string().required('Email is required'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
    name: Yup.string(), // Name is optional
    organization: Yup.string()
  });


  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(SignupSchema),
    defaultValues,
  });


  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onSubmit = async (data: FormValuesProps) => {

    if (step === 1) {
      setFormData(prev => ({ ...prev, ...data }));
      setStep(2);
    }

    if (step === 2) {
      const { email, password, name, organization } = { ...formData, ...data };
      try {
        await register(email, password, name || '', organization || '');
        // router.push('/dashboard/home');
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleGoBack = () => {
    setStep(1);
  }

  const navigateToSignIn = () => {
    router.push('/auth/signin');
  };

  //if formdata is not empty, set the form values
  React.useEffect(() => {
    if (Object.keys(formData).length) {
      Object.keys(formData).forEach(key => {
        setValue(key, formData[key]);
      });
    }
  }, [formData]);

  React.useEffect(() => {
    if (signUpComplete) {
      router.push('/auth/signin');
    }
  }, [signUpComplete]);

  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        width: {
          xs: '100%',
          sm: pxToRem(564)
        },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {step === 2 &&
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={pxToRem(4)}
          sx={{ cursor: "pointer", mb: 2 }}
        >
          <BackIcon />
          <Typography
            variant="subtitle2"
            color={SECONDARY[300]}
            fontSize={pxToRem(14)}
            onClick={handleGoBack}
          >
            Go back
          </Typography>
        </Stack>
      }
      <LogoBlack />
      <Typography variant="h1" sx={{ mt: 2 }}>
        Lets setup your account
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Welcome aboard! Create your account to begin your journey with us.
      </Typography>
      {error && <Alert severity="error" sx={{ my: 1 }}>{error.toString() || 'An Error occurred'}</Alert>}
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>

        {step === 1 ? (
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <RHFTextField name="email" label="" placeholder="Email" required />
            <RHFTextField name="password" label="" placeholder="Password" type={showPassword ? 'text' : 'password'} endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  disableRipple
                  disableFocusRipple
                  disableTouchRipple
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            } />
            <RHFTextField name="confirmPassword" label="" placeholder="Confirm Password" type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />

            <Button type="submit" fullWidth variant="contained" sx={{
              height: pxToRem(56),
            }}>
              Next
            </Button>
          </Box>
        ) : (
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <RHFTextField name="name" label="" placeholder="Name" required />
            <RHFTextField name="organization" label="" placeholder="Organization Name" required />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label={
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={0.5}>
                  <Typography>{`I agree to the `}</Typography><Link href="#" variant="body2" underline="always">Terms of Service</Link> <Typography> and </Typography> <Link href="#" variant="body2" underline="always">Privacy Policy</Link>
                </Stack>
              }
            />
            <Button type="submit" fullWidth variant="contained" disabled={isLoading} sx={{
              height: pxToRem(56),
            }}>
              {isLoading ? 'Loading...' : 'Create account'}
            </Button>
          </Box>
        )}
      </FormProvider>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          mt: 2,
          gap: 0.5
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Already have an account?
        </Typography>
        <Link href="#" variant="body2" align="center" underline="none" onClick={navigateToSignIn}>
          {"Log in"}
        </Link>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <StepDots activeStep={step} />
      </Box>
    </Box>
  );
}