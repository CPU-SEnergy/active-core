import { Input } from "./ui/input";

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  showError?: boolean; // Add this prop to control error display
}

export const InputText: React.FC<InputTextProps> = ({
  id,
  label,
  type = "text",
  value,
  placeholder,
  onChange,
  error,
  showError = true, // Default to true for backward compatibility
  ...props
}) => {
  const autocompleteType = type === "password" ? "new-password" : type === "email" ? "email" : "off";

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder ?? `Enter your ${label.toLowerCase()}`}
        className={`w-full rounded-md border p-2 h-10 ${error ? 'border-red-500' : ''}`}
        required
        autoComplete={autocompleteType}
        {...props}
      />
      {showError && error && <p className="text-red-500 text-xs italic">{error}</p>}
    </div>
  );
};
