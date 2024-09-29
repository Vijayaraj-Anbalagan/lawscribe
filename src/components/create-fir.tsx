'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Mic } from "lucide-react"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  incidentDescription: z.string().min(10, {
    message: "Incident description must be at least 10 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  dateTime: z.date({
    required_error: "A date and time is required.",
  }),
  officerName: z.string().min(2, {
    message: "Officer name must be at least 2 characters.",
  }),
})

export function CreateFir() {
  const [isRecording, setIsRecording] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      incidentDescription: "",
      location: "",
      dateTime: new Date(),
      officerName: "John Doe", // Pre-filled officer name
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Here you would typically send the FIR data to your backend
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Here you would typically implement the voice-to-text functionality
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#8B0000]">Create New FIR</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="incidentDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incident Description<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the incident in detail" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the incident location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date and Time<span className="text-red-500">*</span></FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP HH:mm")
                            ) : (
                              <span>Pick a date and time</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="officerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Officer Name</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex items-center space-x-4">
                <Button 
                  type="button" 
                  onClick={toggleRecording}
                  className={`bg-[#000080] hover:bg-[#000060] ${isRecording ? 'animate-pulse' : ''}`}
                >
                  <Mic className="mr-2 h-4 w-4" />
                  {isRecording ? 'Stop Recording' : 'Start Voice Input'}
                </Button>
                {isRecording && (
                  <Alert variant="destructive">
                    <AlertDescription>Audio is being recorded...</AlertDescription>
                  </Alert>
                )}
              </div>
              <Button type="submit" className="w-full bg-[#8B0000] hover:bg-[#6B0000]">
                Submit FIR
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}