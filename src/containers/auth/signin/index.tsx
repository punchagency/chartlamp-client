"use client";
import { Button } from '@/components/Button';
import FormProvider from '@/components/hook-form/FormProvider';
import LogoBlack from '@/components/LogoBlack';
import { pxToRem } from '@/theme';
import { Alert, IconButton, InputAdornment, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import * as Yup from 'yup';
// form
import { useAuthContext } from '@/auth/useAuthContext';
import { RHFTextField } from '@/components/hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Visibility } from '../components/svgs/Visibility';
import { VisibilityOff } from '../components/svgs/VisibilityOff';

// TODO remove, this demo shouldn&apos;t need to reset the theme.

type FormValuesProps = {
  email: string;
  password: string;
  afterSubmit?: string;
};

export default function SignIn() {
  const router = useRouter();

  const { login, error, isLoading, user, isAuthenticated, signUpComplete } = useAuthContext();

  const [showPassword, setShowPassword] = React.useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    // setError,
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
    try {
      await login(data.email, data.password);
    } catch (err) {
      reset();
      console.log(err);
      // setError('email', { type: 'manual', message: err.message });
    }
  };

  useEffect(() => {
    if (user && !isAuthenticated) {
      router.push('/auth/two-factor');
    }else if (isAuthenticated && user) {
      router.push('/dashboard/home');
    }
  }, [isAuthenticated, user]);

  const navigateToSignUp = () => {
    router.push('/auth/signup');
  };

  const navigateToFogotPassword = () => {
    router.push('/auth/forgot-password');
  }

  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        width:{
          xs: '100%',
          sm: pxToRem(564)
        },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <LogoBlack />
      <Typography variant="h1" sx={{ mt: 2 }}>
        Welcome to ChartLamp
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
        Welcome! Enter your details to sign in and unlock your personalized experience.
      </Typography>
      {error && <Alert severity="error" sx={{my: 1}}>{error.toString() || 'An Error occurred'}</Alert>}
      {signUpComplete && !error && <Alert severity="success" sx={{my: 1}}>Sign up complete, please login</Alert>}
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <RHFTextField name="email" label="" placeholder="Email" required />
          <RHFTextField
            name="password"
            label=""
            placeholder='Password'
            type={showPassword ? 'text' : 'password'}
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
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Link href="#" variant="body2" underline='none' onClick={navigateToFogotPassword}>
              Forgot password?
            </Link>
          </Stack>
          <Button
            type="submit"
            fullWidth
            disabled={isLoading}
            variant="contained"
            sx={{
              height: pxToRem(56),
            }}
          >
            {isLoading ? 'Loading...' : 'Login'}
          </Button>
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              Don&#39;t have an account?
            </Typography>
            <Link href="#" variant="body2" onClick={navigateToSignUp} underline='none'>
              {"Sign Up"}
            </Link>
          </Stack>
        </Box>
      </FormProvider>
    </Box>
  );
}