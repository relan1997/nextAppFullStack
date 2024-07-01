"use client";
import { useToast } from "@/components/ui/use-toast";
import { signUpSchema } from "@/schemas/signUpSchema";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";

const VerifyAccount = () => {
  const router = useRouter(); // ab kisi ko bhi kidhar bhi hum redirect kar sakte hai
  const params = useParams<{ username: string }>(); // so as to access the username from the parameter list
  const { toast } = useToast();
  const form = useForm<z.infer<typeof verifySchema>>({
    // this is the variable used by the react hook form to pass data to the backend
    // yaha pe we have just said ki jo form object return karega woh signUpSchema type ka hoga
    resolver: zodResolver(verifySchema), // a resolver is basically a function that is used to run the schema that we have built
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    //So, z.infer<typeof verifySchema> in your onSubmit function is inferring the TypeScript type that matches the schema defined in verifySchema. This means that the data parameter of the onSubmit function will have a type that matches the structure defined in verifySchema, ensuring type safety.
    try {
      const response = await axios.post("/api/verify-code", {
        username: params.username, // params mai se username extract kar lia
        code: data.code, // jab form submit hoga toh code ko hume form se hi pass karwa denge
      });
      toast({
        title: "Success",
        description: response.data.message, // post request se ek response aayega usko access kia jaa rha hai
      });
      router.replace(`sign-in`);
    } catch (error) {
      console.error("Error in Sign-Up of User", error);
      const axiosError = error as AxiosError<ApiResponse>; // a typescript check of the the type of response thats sent as the error
      toast({
        title: "Verification error",
        description:
          axiosError.response?.data.message ?? "Error in verifying code",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">
            Enter the Verfication Code that is sent to your email
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyAccount;
