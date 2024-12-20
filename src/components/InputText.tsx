import { Input } from "./ui/input";

export const InputText = ({
  id,
  label,
  type = "text",
  value,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const autocompleteType = type === "password" ? "new-password" : type === "email" ? "email" : "off";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={`Enter your ${label.toLowerCase()}`}
        className="w-full rounded-md border p-2"
        required
        autoComplete={autocompleteType}
      />
    </div>
  );
};
