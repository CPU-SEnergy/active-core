import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { FormField, FormItem, FormLabel, FormControl } from "../ui/form";
import { ApparelType, CoachType, ClassType, ProductType } from "@/lib/types/product";
import { formatEnumText } from "@/utils/helpers/formatEnumText";

import { UseFormReturn } from "react-hook-form";

interface DisplaySelectFieldTypesProps {
  type: string
  form: UseFormReturn<ProductFormData>
}

export function DisplaySelectFieldTypes({ type, form }: DisplaySelectFieldTypesProps) {
  let options: string[] = [];

  if (type === ProductType.APPARELS) {
    options = Object.values(ApparelType);
  } else if (type === ProductType.COACHES) {
    options = Object.values(CoachType);
  } else if (type === ProductType.CLASSES) {
    options = Object.values(ClassType);
  }

  if (!options.length) return null;

  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type of Product</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {formatEnumText(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
