"use client";
import { LayoutComponent } from '@/components/layout'
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
import { useRouter } from 'next/navigation';

// Define schema for form validation
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
});

export default function CreateFIR() {
  // Declare state for recording
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]); // Declare as Blob[] to hold audio data
  const router = useRouter();

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      incidentDescription: "",
      location: "",
      dateTime: new Date(),
      officerName: "",
    },
  });

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    router.push('/suggestions');
  }

  // Toggle recording state and start/stop media recording
  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        // Start recording
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);

        recorder.ondataavailable = (event: BlobEvent) => {
          if (event.data.size > 0) {
            setAudioChunks((prevChunks) => [...prevChunks, event.data]); // Add audio data to chunks
          }
        };

        recorder.onstop = saveRecording;
        recorder.start(); // Start the recording process without chunking

        setMediaRecorder(recorder);
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    } else {
      // Stop recording
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
    }
    setIsRecording(!isRecording);
  };

  // Save recorded audio as an MP3 file
  const saveRecording = () => {
    if (audioChunks.length === 0) {
      console.warn("No audio chunks recorded.");
      return;
    }

    const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
    const audioUrl = URL.createObjectURL(audioBlob);

    // Create a link to download the file
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `FIR01-${new Date().toISOString()}.mp3`; // Save as .mp3 file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Reset audio chunks after saving
    setAudioChunks([]);
    setMediaRecorder(null); // Reset the mediaRecorder
  };

  return (
    <LayoutComponent>
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
                        <Input {...field} />
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
    </LayoutComponent>
  );
}
