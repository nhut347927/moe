import { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "@/services/axios/axios-instance";
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

import { Alert, AlertDescription } from "@/components/ui/alert";
export default function ForgotPassword() {
  const { toast } = useToast();
  const [message, setMessage] = useState<any>();

  const [errorMessages, setErrorMessages] = useState<any>({});

  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: any) {
    try {
      const response = await axiosInstance.post(
        "auth/request-password-reset",
        {
          email: values.email,
        }
      );
      if (response?.data?.code == 200) {
        setMessage(response.data.message);
      } else {
        toast({
          variant: "default",
          description: <p className="text-lime-500">{response.data.message}</p>,
        });
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast({
          variant: "destructive",
          description: error.response.data.message || "An error occurred!",
        });
        setMessage(null);
        setErrorMessages(null);
        const { errors } = error.response.data;
        if (errors) {
          setErrorMessages(errors);
        }
      }
    }
  }

  return (
    <div className="flex min-h-[40vh] h-full w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address to receive a password reset link.
          </CardDescription>
          {message && (
            <Alert className="bg-[rgb(30,255,0,0.3)] ">
              <AlertDescription className="text-lime-300">
                {message}
              </AlertDescription>
            </Alert>
          )}
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
                <Button type="submit" className="w-full">
                  Send Reset Link
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
