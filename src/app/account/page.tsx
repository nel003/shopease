"use client"
import {use, useState} from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { usernameIsValid, emailIsValid, passwordIsValid } from '@/utils/validate';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import axios from 'axios';
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox";
import { CircleAlert, Eye, EyeOff } from "lucide-react";

function CardWithForm() {
  const router = useRouter();
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [usernameIsError, setUsernameIsError] = useState([true, ""]);
  const [passwordIsError, setPasswordIsError] = useState([true, ""]);
  const [emailIsError, setEmailIsError] = useState([true, ""]);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target

    if (target.name === "username") {
      setUsername(target.value);
      setUsernameIsError(usernameIsValid(target.value));
      return;
    }
    if (target.name === "email") {
      setEmail(target.value);
      setEmailIsError(emailIsValid(target.value));
      return;
    }
    if (target.name === "password") {
      setPassword(target.value);
      setPasswordIsError(passwordIsValid(target.value));
      return;
    }

    setUsernameIsError([false, ""]);
  }

  async function submit(e: React.MouseEvent<HTMLButtonElement>) {
    const target = e.target as HTMLButtonElement;
    target.disabled = true;
    target.innerText = "Submitting...";

    try {
      const res = await axios({
        url: '/api/register',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          username, email, password
        })  
      });
      target.innerText = "Success";
      localStorage.setItem("token", res.data.token);
      setTimeout(() => {
        router.push("/home");
      }, 1000)

      return;

    } catch (error: any) {
      const err = error.response.data;
      if(err.field === "username") {
        setUsernameIsError([false, err.message]);
        console.log("err")
      }
      if(err.field === "email") {
        setEmailIsError([false, err.message]);
      }
      if(err.field === "password") {
        setPasswordIsError([false, err.message]);
      }

      toast({
        title: "Registration Failed",
        description: err.message,
      })
    }

    target.innerText = "Sign Up";
    target.disabled = false;
  }

  async function login(e: React.MouseEvent<HTMLButtonElement>) {
    const target = e.target as HTMLButtonElement;
    target.disabled = true;
    target.innerText = "Processing...";
    try {
      const res = await axios({
        url: '/api/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          username, password
        })  
      });
      target.innerText = "Success";
      localStorage.setItem("token", res.data.token);
      setTimeout(() => {
        router.push("/home");
      }, 1000)

      return;
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.response.data.message,
      })
    }
    target.innerText = "Log In";
    target.disabled = false;
  }

  return (
    <div className="w-screen h-screen grid place-items-center">
        <Tabs defaultValue="register" className="w-[350px]">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
            <TabsContent value="register">
                <Card className="w-[350px]">
                    <CardHeader>
                    <CardTitle>Sign up with us </CardTitle>
                    </CardHeader>
                    <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5 relative">
                            <Label htmlFor="name">Username</Label>
                            <Input onChange={handleInput} value={username} name="username" id="username" placeholder="Enter your username" />
                            <div className={`absolute right-0 -top-3 ${username !== "" && !usernameIsError[0] ? "block" : "hidden"}`}>
                            <Popover>
                                <PopoverTrigger asChild>
                                <div className="w-5 h-5">
                                    <CircleAlert className="text-red-400/75 w-4"/>
                                </div>
                                </PopoverTrigger>
                                <PopoverContent align="end" side="top" className="py-2">{usernameIsError[1]}</PopoverContent>
                            </Popover>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1.5 relative">
                            <Label htmlFor="name">Email</Label>
                            <Input onChange={handleInput} value={email} name="email" id="email" type="email" placeholder="Enter your email address" />
                            <div className={`absolute right-0 -top-3 ${email !== "" && !emailIsError[0] ? "block" : "hidden"}`}>
                            <Popover>
                                <PopoverTrigger asChild>
                                <div className="w-5 h-5">
                                    <CircleAlert className="text-red-400/75 w-4"/>
                                </div>
                                </PopoverTrigger>
                                <PopoverContent align="end" side="top" className="py-2">{emailIsError[1]}</PopoverContent>
                            </Popover>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1.5 relative">
                            <Label htmlFor="password">Password</Label>
                            <Input onChange={handleInput} value={password} id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" />
                            <div onClick={() => setShowPassword(!showPassword)} className="absolute h-6 w-6 right-3 top-[22px] cursor-pointer">
                            <Eye className={`w-5 text-primary/40 ${showPassword ? "hidden" : "block"}`}/>
                            <EyeOff className={`w-5 text-primary/40 ${showPassword ? "block" : "hidden"}`}/>
                            </div>
                            <div className={`absolute right-0 -top-3 ${password !== "" && !passwordIsError[0] ? "block" : "hidden"}`}>
                            <Popover>
                                <PopoverTrigger asChild>
                                <div className="w-5 h-5">
                                    <CircleAlert className="text-red-400/75 w-4"/>
                                </div>
                                </PopoverTrigger>
                                <PopoverContent align="end" side="top" className="py-2">{passwordIsError[1]}</PopoverContent>
                            </Popover>
                            </div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Checkbox onCheckedChange={(c: boolean) => setAcceptTerms(c)} checked={acceptTerms} id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium mt-[2px] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Accept terms and conditions
                            </label>
                        </div>
                        </div>
                    </form>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                    <Button onClick={submit} disabled={!usernameIsError[0] || !emailIsError[0] || !passwordIsError[0] || username == "" || email == "" || password == "" || !acceptTerms} className="w-full">Sign Up</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="login">
                  <Card>
                  <CardHeader>
                    <CardTitle>Welcome Back</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form>
                      <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="username">Username</Label>
                          <Input onChange={(e) => setUsername(e.target.value)} value={username} id="username" placeholder="Enter your username" />
                        </div>
                        <div className="flex flex-col space-y-1.5 relative">
                            <Label htmlFor="password">Password</Label>
                            <Input onChange={handleInput} value={password} id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" />
                            <div onClick={() => setShowPassword(!showPassword)} className="absolute h-6 w-6 right-3 top-[22px] cursor-pointer">
                            <Eye className={`w-5 text-primary/40 ${showPassword ? "hidden" : "block"}`}/>
                            <EyeOff className={`w-5 text-primary/40 ${showPassword ? "block" : "hidden"}`}/>
                            </div>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button onClick={login} disabled={username.trim() === "" || password.trim() === ""} className="w-full">Login</Button>
                  </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}

export default CardWithForm;
