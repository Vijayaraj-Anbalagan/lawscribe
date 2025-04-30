import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

interface MultiStepFormContextValue {
  currentStep: number;
  totalSteps: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isComplete: boolean;
  markComplete: () => void;
}

const MultiStepFormContext = createContext<MultiStepFormContextValue | undefined>(
  undefined
);

export function useMultiStepForm() {
  const context = useContext(MultiStepFormContext);
  if (!context) {
    throw new Error(
      "useMultiStepForm must be used within a MultiStepFormProvider"
    );
  }
  return context;
}

interface MultiStepFormProps {
  children: React.ReactNode;
  totalSteps: number;
  initialStep?: number;
  className?: string;
  onComplete?: () => void;
}

export function MultiStepForm({
  children,
  totalSteps,
  initialStep = 0,
  className,
  onComplete,
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isComplete, setIsComplete] = useState(false);

  const goToNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  };

  const markComplete = () => {
    setIsComplete(true);
    if (onComplete) {
      onComplete();
    }
  };

  const contextValue: MultiStepFormContextValue = {
    currentStep,
    totalSteps,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    isComplete,
    markComplete,
  };

  return (
    <MultiStepFormContext.Provider value={contextValue}>
      <div className={cn("space-y-6", className)}>
        <MultiStepFormProgress />
        {children}
      </div>
    </MultiStepFormContext.Provider>
  );
}

interface MultiStepFormProgressProps {
  className?: string;
}

export function MultiStepFormProgress({ className }: MultiStepFormProgressProps) {
  const { currentStep, totalSteps, goToStep } = useMultiStepForm();
  
  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <div className="h-[2px] w-10 bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  width: currentStep >= index ? "100%" : "0%",
                }}
              />
            </div>
          )}
          <button
            onClick={() => goToStep(index)}
            className={cn(
              "h-8 w-8 rounded-full text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex items-center justify-center",
              currentStep >= index
                ? "bg-primary text-primary-foreground"
                : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {currentStep > index ? <Check className="h-3 w-3" /> : index + 1}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}

interface FormStepProps {
  children: React.ReactNode;
  step: number;
  className?: string;
}

export function FormStep({ children, step, className }: FormStepProps) {
  const { currentStep } = useMultiStepForm();

  if (step !== currentStep) {
    return null;
  }

  return <div className={cn("space-y-4", className)}>{children}</div>;
}

export function FormNavigation({ className }: { className?: string }) {
  const { goToPreviousStep, goToNextStep, isFirstStep, isLastStep, markComplete } =
    useMultiStepForm();

  return (
    <div
      className={cn(
        "flex items-center justify-between pt-4 mt-4 border-t",
        className
      )}
    >
      <Button
        variant="outline"
        onClick={goToPreviousStep}
        disabled={isFirstStep}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
      </Button>
      {isLastStep ? (
        <Button onClick={markComplete}>
          Complete <Check className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button onClick={goToNextStep}>
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}