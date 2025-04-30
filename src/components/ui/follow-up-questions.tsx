import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface Question {
  question: string;
  purpose?: string;
  priority?: number;
  answer?: string;
}

interface FollowUpQuestionsProps {
  questions: Question[];
  onAnswerChange: (index: number, answer: string) => void;
  className?: string;
}

export function FollowUpQuestions({
  questions,
  onAnswerChange,
  className,
}: FollowUpQuestionsProps) {
  if (!questions || questions.length === 0) {
    return null;
  }

  // Sort questions by priority if available (lower number = higher priority)
  const sortedQuestions = [...questions].sort((a, b) => {
    if (a.priority !== undefined && b.priority !== undefined) {
      return a.priority - b.priority;
    }
    return 0;
  });

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-medium">Follow-up Questions</h3>
      <p className="text-sm text-muted-foreground">
        Please answer these additional questions to provide more details about the incident:
      </p>
      
      <Accordion type="single" collapsible className="w-full">
        {sortedQuestions.map((question, index) => (
          <QuestionItem 
            key={index}
            question={question}
            index={index}
            onAnswerChange={onAnswerChange}
          />
        ))}
      </Accordion>
    </div>
  );
}

interface QuestionItemProps {
  question: Question;
  index: number;
  onAnswerChange: (index: number, answer: string) => void;
}

function QuestionItem({ question, index, onAnswerChange }: QuestionItemProps) {
  const [answer, setAnswer] = useState(question.answer || "");
  const priorityLabels = ["Critical", "High", "Medium", "Low", "Optional"];
  
  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
  };
  
  const handleSaveAnswer = () => {
    onAnswerChange(index, answer);
  };
  
  const priorityLabel = question.priority !== undefined && question.priority >= 1 && question.priority <= 5
    ? priorityLabels[question.priority - 1]
    : null;
    
  const priorityColorClass = () => {
    if (question.priority === 1) return "bg-red-100 text-red-800";
    if (question.priority === 2) return "bg-orange-100 text-orange-800";
    if (question.priority === 3) return "bg-yellow-100 text-yellow-800";
    if (question.priority === 4) return "bg-blue-100 text-blue-800";
    if (question.priority === 5) return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <AccordionItem value={`item-${index}`}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center text-left">
          <span>{question.question}</span>
          {priorityLabel && (
            <span className={cn("ml-2 text-xs px-2 py-0.5 rounded-full", priorityColorClass())}>
              {priorityLabel}
            </span>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {question.purpose && (
          <p className="mb-2 text-sm text-muted-foreground italic">
            {question.purpose}
          </p>
        )}
        <div className="space-y-3">
          <Textarea 
            placeholder="Enter your answer here..." 
            className="min-h-[100px]" 
            value={answer}
            onChange={handleAnswerChange}
          />
          <Button size="sm" onClick={handleSaveAnswer}>
            Save Answer
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}