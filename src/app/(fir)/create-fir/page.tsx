"use client";
import { LayoutComponent } from '@/components/layout'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Mic, MicOff, Loader2, BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation'
import { MultiStepForm, FormStep, FormNavigation } from "@/components/ui/multi-step-form"
import { ConfidenceBadge } from "@/components/ui/confidence-badge"
import { FollowUpQuestions, Question } from "@/components/ui/follow-up-questions"
import { ScrollArea } from "@/components/ui/scroll-area"

// Define schema for form validation
const formSchema = z.object({
  // Complainant Information
  complainantName: z.string().min(2, {
    message: "Complainant name must be at least 2 characters.",
  }),
  complainantContact: z.string().min(10, {
    message: "Contact number must be at least 10 characters.",
  }),
  complainantAddress: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  
  // Incident Details
  incidentDescription: z.string().min(10, {
    message: "Incident description must be at least 10 characters.",
  }),
  incidentLocation: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  incidentDate: z.date({
    required_error: "A date is required.",
  }),
  
  // Optional Details
  suspectDetails: z.string().optional(),
  witnessDetails: z.string().optional(),
  evidenceDetails: z.string().optional(),
  
  // Officer Information
  officerName: z.string().min(2, {
    message: "Officer name must be at least 2 characters.",
  }),
  officerRank: z.string().min(1, {
    message: "Officer rank is required.",
  }),
  policeStationName: z.string().min(2, {
    message: "Police station name is required.",
  }),
});

// Type for legal section suggestion
interface LegalSection {
  section: string;
  title: string;
  description: string;
  relevance?: string;
  confidence?: number;
}

export default function CreateFIR() {
  // States for the form, recording, and AI features
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [legalSections, setLegalSections] = useState<LegalSection[]>([]);
  const [followUpQuestions, setFollowUpQuestions] = useState<Question[]>([]);
  const [selectedLegalSections, setSelectedLegalSections] = useState<string[]>([]);
  
  const router = useRouter();

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      complainantName: "",
      complainantContact: "",
      complainantAddress: "",
      incidentDescription: "",
      incidentLocation: "",
      incidentDate: new Date(),
      suspectDetails: "",
      witnessDetails: "",
      evidenceDetails: "",
      officerName: "",
      officerRank: "",
      policeStationName: "",
    },
  });
  
  const incidentDescription = form.watch("incidentDescription");

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    
    // Gather selected legal sections and follow-up question answers
    const finalData = {
      ...values,
      legalSections: legalSections.filter(section => 
        selectedLegalSections.includes(section.section)
      ),
      followUpQuestions: followUpQuestions.map(q => ({
        question: q.question,
        answer: q.answer || "",
        purpose: q.purpose,
        priority: q.priority
      }))
    };
    
    console.log("Final submission data:", finalData);
    
    // In a real app, you would save this to the database here
    
    // Navigate to the review page
    router.push('/fir-review');
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
            setAudioChunks((prevChunks) => [...prevChunks, event.data]);
          }
        };

        recorder.onstop = processRecording;
        recorder.start();

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

  // Process recorded audio by sending it to transcription API
  const processRecording = async () => {
    if (audioChunks.length === 0) {
      console.warn("No audio chunks recorded.");
      return;
    }

    const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
    
    try {
      setIsTranscribing(true);
      
      // Send audio to transcription API
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.transcription) {
        // Update the form with transcribed text
        const currentDescription = form.getValues("incidentDescription");
        const updatedDescription = currentDescription 
          ? `${currentDescription}\n${data.transcription}`
          : data.transcription;
        
        form.setValue("incidentDescription", updatedDescription);
      }
    } catch (error) {
      console.error("Error transcribing audio:", error);
    } finally {
      setIsTranscribing(false);
      setAudioChunks([]);
      setMediaRecorder(null);
    }
  };

  // Generate legal section suggestions based on incident description
  const generateLegalSuggestions = async () => {
    if (!incidentDescription || incidentDescription.length < 10) {
      return;
    }
    
    setIsGeneratingSuggestions(true);
    
    try {
      const response = await fetch('/api/suggestions/legal-sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ incidentDescription }),
      });
      
      const data = await response.json();
      
      if (data.suggestions) {
        setLegalSections(data.suggestions);
        // Auto-select high confidence suggestions
        const highConfidenceSections = data.suggestions
          .filter((section: LegalSection) => section.confidence && section.confidence > 75)
          .map((section: LegalSection) => section.section);
        
        setSelectedLegalSections(highConfidenceSections);
      }
    } catch (error) {
      console.error("Error generating legal suggestions:", error);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  // Generate follow-up questions based on incident description
  const generateFollowUpQuestions = async () => {
    if (!incidentDescription || incidentDescription.length < 10) {
      return;
    }
    
    setIsGeneratingQuestions(true);
    
    try {
      const response = await fetch('/api/suggestions/follow-up-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ incidentDescription }),
      });
      
      const data = await response.json();
      
      if (data.questions) {
        setFollowUpQuestions(data.questions);
      }
    } catch (error) {
      console.error("Error generating follow-up questions:", error);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Handle answers to follow-up questions
  const handleAnswerChange = (index: number, answer: string) => {
    const updatedQuestions = [...followUpQuestions];
    updatedQuestions[index].answer = answer;
    setFollowUpQuestions(updatedQuestions);
  };

  // Toggle selection of legal sections
  const toggleLegalSection = (section: string) => {
    if (selectedLegalSections.includes(section)) {
      setSelectedLegalSections(selectedLegalSections.filter(s => s !== section));
    } else {
      setSelectedLegalSections([...selectedLegalSections, section]);
    }
  };

  return (
    <LayoutComponent>
      <div className="min-h-screen bg-white p-4 md:p-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-[#8B0000]">Create New FIR</CardTitle>
            <CardDescription className="text-center">
              First Information Report - Fill in the details below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <MultiStepForm totalSteps={4}>
                  {/* Step 1: Complainant Information */}
                  <FormStep step={0}>
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Complainant Information</h2>
                      <FormField
                        control={form.control}
                        name="complainantName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name<span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter complainant's full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="complainantContact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Number<span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter contact number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="complainantAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address<span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Textarea placeholder="Enter complete address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormNavigation />
                  </FormStep>

                  {/* Step 2: Incident Details */}
                  <FormStep step={1}>
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Incident Details</h2>
                      <FormField
                        control={form.control}
                        name="incidentDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Incident Description<span className="text-red-500">*</span></FormLabel>
                            <div className="flex items-center mb-2">
                              <Button 
                                type="button" 
                                onClick={toggleRecording}
                                variant="outline"
                                size="sm"
                                className={`${isRecording ? 'text-red-500 border-red-500' : ''}`}
                              >
                                {isRecording ? (
                                  <>
                                    <MicOff className="mr-2 h-4 w-4" />
                                    Stop Recording
                                  </>
                                ) : (
                                  <>
                                    <Mic className="mr-2 h-4 w-4" />
                                    Voice Input
                                  </>
                                )}
                              </Button>
                              {isTranscribing && (
                                <div className="ml-2 flex items-center">
                                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                  <span className="text-sm text-muted-foreground">Transcribing...</span>
                                </div>
                              )}
                            </div>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe the incident in detail" 
                                className="min-h-[150px]" 
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="incidentLocation"
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
                        name="incidentDate"
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
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
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
                    </div>
                    <div className="flex justify-between mt-6">
                      <Button
                        type="button"
                        onClick={generateLegalSuggestions}
                        disabled={!incidentDescription || incidentDescription.length < 10 || isGeneratingSuggestions}
                      >
                        {isGeneratingSuggestions ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          "Get Legal Suggestions"
                        )}
                      </Button>
                      <Button
                        type="button"
                        onClick={generateFollowUpQuestions}
                        disabled={!incidentDescription || incidentDescription.length < 10 || isGeneratingQuestions}
                        variant="outline"
                      >
                        {isGeneratingQuestions ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          "Get Follow-up Questions"
                        )}
                      </Button>
                    </div>
                    <FormNavigation />
                  </FormStep>

                  {/* Step 3: Legal Sections & Additional Questions */}
                  <FormStep step={2}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Applicable Legal Sections</h2>
                        {legalSections.length > 0 ? (
                          <ScrollArea className="h-[250px] pr-4">
                            <div className="space-y-3">
                              {legalSections.map((section, index) => (
                                <Card 
                                  key={index}
                                  className={cn(
                                    "cursor-pointer transition-colors",
                                    selectedLegalSections.includes(section.section)
                                      ? "border-primary bg-primary/5"
                                      : ""
                                  )}
                                  onClick={() => toggleLegalSection(section.section)}
                                >
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h3 className="font-semibold flex items-center">
                                          {section.section}: {section.title}
                                          {selectedLegalSections.includes(section.section) && (
                                            <BadgeCheck className="ml-2 h-4 w-4 text-primary" />
                                          )}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                          {section.description}
                                        </p>
                                        {section.relevance && (
                                          <p className="text-sm mt-2 italic">
                                            {section.relevance}
                                          </p>
                                        )}
                                      </div>
                                      {section.confidence !== undefined && (
                                        <ConfidenceBadge value={section.confidence} />
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </ScrollArea>
                        ) : (
                          <div className="text-center p-6 border rounded-md bg-muted/20">
                            <p>No legal sections generated yet. Please describe the incident and generate suggestions.</p>
                          </div>
                        )}
                      </div>
                    
                      <div>
                        <FollowUpQuestions 
                          questions={followUpQuestions} 
                          onAnswerChange={handleAnswerChange}
                        />
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Additional Details</h3>
                        <FormField
                          control={form.control}
                          name="suspectDetails"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Suspect Details</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Enter details about any suspects" 
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
                          name="witnessDetails"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Witness Details</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Enter details about any witnesses" 
                                  className="min-h-[80px]" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="evidenceDetails"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Evidence Details</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Enter details about any evidence" 
                                  className="min-h-[80px]" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <FormNavigation />
                  </FormStep>

                  {/* Step 4: Officer Information */}
                  <FormStep step={3}>
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Officer Information</h2>
                      <FormField
                        control={form.control}
                        name="officerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Officer Name<span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter officer's name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="officerRank"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Officer Rank<span className="text-red-500">*</span></FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              value={field.value || undefined} 
                              defaultValue={field.value || undefined}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select officer rank" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="constable">Police Constable</SelectItem>
                                <SelectItem value="headConstable">Head Constable</SelectItem>
                                <SelectItem value="assistantSubInspector">Assistant Sub-Inspector</SelectItem>
                                <SelectItem value="subInspector">Sub-Inspector</SelectItem>
                                <SelectItem value="inspector">Inspector</SelectItem>
                                <SelectItem value="dsp">Deputy Superintendent of Police</SelectItem>
                                <SelectItem value="sp">Superintendent of Police</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="policeStationName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Police Station<span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter police station name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full mt-6 bg-[#8B0000] hover:bg-[#6B0000]">
                        Submit FIR
                      </Button>
                    </div>
                  </FormStep>
                </MultiStepForm>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </LayoutComponent>
  );
}
