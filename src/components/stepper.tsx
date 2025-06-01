import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Desktop version */}
      <div className="hidden sm:flex justify-center items-start">
        <div className="flex items-start">
          {steps.map((step, index) => {
            const isCompleted = currentStep > index + 1;
            const isActive = currentStep === index + 1;

            return (
              <div key={index} className="flex items-start">
                {/* Step container with fixed width for consistent alignment */}
                <div className="flex flex-col items-center w-24 sm:w-32">
                  {/* Step circle */}
                  <div
                    className={cn(
                      "w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2 sm:border-3 transition-all duration-300 ease-in-out relative",
                      isCompleted
                        ? "bg-black border-black text-white shadow-lg"
                        : isActive
                          ? "border-black text-black bg-white shadow-lg"
                          : "border-gray-300 text-gray-400 bg-gray-50"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4 sm:h-6 sm:w-6 animate-in fade-in-0 zoom-in-95 duration-300" />
                    ) : (
                      <span
                        className={cn(
                          "transition-all duration-200",
                          isActive && "scale-110"
                        )}
                      >
                        {index + 1}
                      </span>
                    )}

                    {/* Ring animation for active step */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full border-2 border-gray-400 animate-pulse opacity-75"></div>
                    )}
                  </div>

                  {/* Step label */}
                  <span
                    className={cn(
                      "mt-2 sm:mt-3 text-xs sm:text-sm font-semibold text-center transition-colors duration-200 px-1 sm:px-2",
                      isActive
                        ? "text-black"
                        : isCompleted
                          ? "text-gray-800"
                          : "text-gray-400"
                    )}
                  >
                    {step}
                  </span>
                </div>

                {/* Connecting line - positioned to connect circle centers */}
                {index < steps.length - 1 && (
                  <div className="flex items-center pt-4 sm:pt-6">
                    <div className="w-12 sm:w-16 h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full bg-black rounded-full transition-all duration-700 ease-in-out",
                          isCompleted ? "w-full" : "w-0"
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile version */}
      <div className="sm:hidden">
        <div className="flex items-center justify-center space-x-2 mb-4">
          {steps.map((_, index) => {
            const isCompleted = currentStep > index + 1;
            const isActive = currentStep === index + 1;

            return (
              <div
                key={index}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  isCompleted
                    ? "bg-black shadow-lg"
                    : isActive
                      ? "bg-gray-800 scale-125 shadow-lg"
                      : "bg-gray-300"
                )}
              />
            );
          })}
        </div>

        {/* Current step info for mobile */}
        <div className="text-center bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-600 font-medium">
            Step {currentStep} of {steps.length}
          </p>
          <p className="text-sm font-bold text-black mt-1">
            {steps[currentStep - 1]}
          </p>
        </div>
      </div>
    </div>
  );
}
