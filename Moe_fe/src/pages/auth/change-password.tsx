import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
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

export default function ChangePassword() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState<any>({});
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const form = useForm({
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });
  async function onSubmit(values: any) {
    try {

      const response = await axiosInstance.put(
        "auth/change-password",
        {
          newPassword: values.newPassword,
          confirmNewPassword: values.confirmNewPassword,
        }
      );
      

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
    <div className="flex min-h-[50vh] h-full w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Change Password</CardTitle>
          <CardDescription>
            Enter your new password to change your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="newPassword">New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="******"
                            autoComplete="new-password"
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
                      {errorMessages?.newPassword && (
                        <FormMessage>{errorMessages.newPassword}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="confirmNewPassword">
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="confirmNewPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="******"
                            autoComplete="confirm-new-password"
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
                      {errorMessages?.confirmNewPassword && (
                        <FormMessage>
                          {errorMessages.confirmNewPassword}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Change Password
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
