'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from 'next/link'

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  mfa: z.string().length(6, {
    message: "MFA code must be 6 characters.",
  }),
})

export function LoginPageComponent() {
  const [error, setError] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      mfa: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically send the login request to your backend
    console.log(values)
    // For demonstration, we'll just set an error
    setError("Invalid credentials. Please try again.")
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#8B0000]">LawScribe - Secure Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} className="rounded-md" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} className="rounded-md" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mfa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Multi-Factor Authentication</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter MFA code" {...field} className="rounded-md" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-[#8B0000] hover:bg-[#6B0000] text-white transition-colors duration-300">
                Login
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center">
            <Link href="/forgot-password" className="text-[#000080] hover:underline text-sm">
              Forgot Password?
            </Link>
          </div>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}