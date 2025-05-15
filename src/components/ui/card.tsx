import React from "react";
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export const Card: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  return <div className={`border-b p-4 ${className}`}>{children}</div>;
};

export const CardTitle: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  return <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>;
};

export const CardContent: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

export const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"
 
export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"