import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axiosInstance from "@/services/axios/axios-instance";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/common/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import { ENV } from "@/common/config/env";
import Cookies from 'js-cookie';

const clientId = ENV.GOOGLE_CLIENT_ID;

export default function Login() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState<any>({});

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Xử lý đăng nhập bằng email & password
  async function onSubmit(values: any) {
    try {
      const response = await axiosInstance.post("auth/login", {
        email: values.email,
        password: values.password,
      });
      Cookies.set("accessToken_fe", response.data.data.accessToken, { expires: 1 });
      Cookies.set("refreshToken_fe", response.data.data.refreshToken, {
        expires: 180,
      });
      toast({
        variant: "default",
        description: <p className="text-lime-500">{response.data.message}</p>,
      });

      navigate("/client/home", { replace: true });
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast({
          variant: "destructive",
          description: error.response.data.message || "An error occurred!",
        });
        setErrorMessages(null);
        const { errors } = error.response.data;
        if (errors) {
          setErrorMessages(errors);
        }
      }
    }
  }

  // Xử lý đăng nhập bằng Google
  const loginGoogleButton = async (response: CredentialResponse) => {
    if (!response.credential) return;

    try {
      const res = await axiosInstance.post("/auth/google-login", {
        token: response.credential,
      });

      toast({
        variant: "default",
        description: <p className="text-lime-500">{res.data.message}</p>,
      });

      navigate("/client/home", { replace: true });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response?.data?.message || "Google login failed!",
      });
    }
  };

  // Xử lý thất bại khi đăng nhập Google
  const handleLoginFailure = () => {
    toast({
      variant: "destructive",
      description: "Google login failed! Please try again.",
    });
  };

  return (
    <div className="flex flex-col min-h-[50vh] h-full w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email and password to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                {/* Email Input */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="johndoe@mail.com"
                          type="text"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      {errorMessages?.email && (
                        <FormMessage>{errorMessages.email}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />

                {/* Password Input */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Link
                          to="/auth/forgot-password"
                          className="ml-auto inline-block text-sm underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="******"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showPassword ? (
                              <Eye className="h-4 w-4 text-zinc-500" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-zinc-500" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      {errorMessages?.password && (
                        <FormMessage>{errorMessages.password}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />

                {/* Nút đăng nhập */}
                <Button type="submit" className="w-full">
                  Login
                </Button>

                {/* Nút đăng nhập Google */}
                <GoogleOAuthProvider clientId={clientId}>
                  <GoogleLogin
                    onSuccess={loginGoogleButton}
                    onError={handleLoginFailure}
                  />
                </GoogleOAuthProvider>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/auth/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
