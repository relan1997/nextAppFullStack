"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue,useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
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
import { Loader2 } from "lucide-react";

const form = useForm({
  // this is the variable used by the react hook form to pass data to the backend
  // yaha pe we have just said ki jo form object return karega woh signUpSchema type ka hoga
  resolver: zodResolver(signUpSchema), // a resolver is basically a function that is used to run the schema that we have built
  defaultValues: {
    username: "",
    email: "",
    password: "",
  }, // these are used to set up the default values of the form after the form has been submitted
});

const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState(""); // when the username is sent to backend for check whether the entered username is available or not , uska status will be reflected in the usernameMessage state
  const [isCheckinguserName, setIsCheckingUserName] = useState(false); // maintaining the state between the request is sent to the backend and a response is recieved
  const [isSubmitting, setIsSubmitting] = useState(false); // to check the state of the form whether it's getting submitted or not
  const debounced = useDebounceCallback(setUsername, 300); // basically jab bhi debounced ke andar value jaayegi tabhi hum backend pe request send karenge
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const checkUserNameUnique = async () => {
      if (username) {
        setIsCheckingUserName(true); // a loader that tells ki haa checking chal rhi hai
        setUsernameMessage(""); // incase pehle isme koi value ho after checking, toh ek nayi value ki checking ke liye hum isse pehle empty kar lete hai
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUsername(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>; // a typescript check of the the type of response thats sent as the error
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUserName(false);
        }
      }
    };
    checkUserNameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    // humme onSubmit yeh data milta hai automatically because of handle submit
    setIsSubmitting(true); // activating the loader telling us that the submission process is taking place
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast({
        title: "Success",
        description: response.data.message,
      }); // this allows for the toast pop up to occur whenever we cann it and it will have the following data
      router.replace(`/verify/${username}`); // this router redirects to the verifyPage jahan pe user apna otp enter karega, ab hume username diya hai param mai toh from that we can extract the user object by making a req to the database
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in Sign-Up of User", error);
      const axiosError = error as AxiosError<ApiResponse>; // a typescript check of the the type of response thats sent as the error
      toast({
        title: "Sign-Up error",
        description: axiosError.response?.data.message ?? "Error in Sign-Up",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        {/* the form object is the one that collects all the data and transfers it forward*/}
        <Form {...form}>
          {" "}
          {/* form variable on line 15 jisme defaultValues mentioned hai */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={(
                { field } // The render function ensures that the input field is properly connected to the form state managed by React Hook Form, making it possible to control and validate the input's value seamlessly. // https://chatgpt.com/c/6352936b-99af-4b26-843c-24d5222e0f84
              ) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value); // written because of the custom usage
                      }}
                    />
                   
                  </FormControl>
                  {isCheckinguserName && <Loader2 className="animate-spin"/>}
                  <p className={`text-sm ${usernameMessage === 'username is available' ? 'text-green-500': 'text-red-500'}`}>
                    test {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={(
                { field } // The render function ensures that the input field is properly connected to the form state managed by React Hook Form, making it possible to control and validate the input's value seamlessly. // https://chatgpt.com/c/6352936b-99af-4b26-843c-24d5222e0f84
              ) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={(
                { field } // The render function ensures that the input field is properly connected to the form state managed by React Hook Form, making it possible to control and validate the input's value seamlessly. // https://chatgpt.com/c/6352936b-99af-4b26-843c-24d5222e0f84
              ) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={isSubmitting }>
              {
                isSubmitting? (
                  <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait
                  </>
                ) : ('Signup')
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
              <p>
                Already a Member?{' '}
                <Link href={'/sign-in'} className="text-blue-600 hover:text-blue-800" >
                Sign In</Link>
              </p>
        </div>
      </div>
    </div>
  );
};

export default page;
