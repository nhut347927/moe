import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
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

export default function Register() {
  const { toast } = useToast();
  const navigate = useNavigate(); // Tạo instance của useNavigate
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState<any>({}); // State để lưu thông báo lỗi từ backend
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  async function onSubmit(values: any) {
    try {
      // Gửi yêu cầu đăng nhập
      const response = await axiosInstance.post("auth/register", {
        displayName: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      toast({
        variant: "default",
        description: <p className="text-lime-500">{response.data.message}</p>,
      });

      navigate("/auth/login", { replace: true });
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

  return (
    <div className="flex min-h-[60vh] h-full w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Create a new account by filling out the form below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                {/* Email Field */}
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

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="******"
                            autoComplete="password"
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

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="confirmPassword">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="******"
                            autoComplete="confirm-password"
                            {...field}
                          />

                          <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showConfirmPassword ? (
                              <Eye className="h-4 w-4 text-zinc-500" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-zinc-500" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      {errorMessages?.confirmPassword && (
                        <FormMessage>
                          {errorMessages.confirmPassword}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="name">Display name</FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          type="text"
                          placeholder="abc123"
                          autoComplete="display-name"
                          {...field}
                        />
                      </FormControl>
                      {errorMessages?.displayName && (
                        <FormMessage>{errorMessages.displayName}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Register
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/auth/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
