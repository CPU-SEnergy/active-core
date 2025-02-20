"use client";

import * as React from "react";
import { Upload, Check, AlertCircle, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { uploadFile } from "@/utils/firebase/helpers/uploadFile";
import { createProduct } from "@/utils/firebase/helpers/createProduct";
import { ProductType } from "@/lib/types/product";
import { formatEnumText } from "@/utils/helpers/formatEnumText";
import { DisplaySelectFieldTypes } from "./DisplaySelectFieldTypes";
import { useRouter } from "next/navigation";

export default function ProductForm() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      price: "",
      product_type: ProductType.APPARELS,
      description: "",
      file: null,
    },
  });

  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file) {
          form.setValue("file", file);
          setUploadedFile(file);
          toast({
            title: "File uploaded",
            description: `${file.name} uploaded successfully.`,
          });
        }
      }
    },
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(({ file, errors }) => {
        toast({
          variant: "destructive",
          title: "File upload error",
          description: `${file.name}: ${errors.map((e) => e.message).join(", ")}`,
        });
      });
    },
  });

  const clearFile = (show: boolean | undefined = true) => {
    show = show ?? false;
    form.setValue("file", null);
    setUploadedFile(null);

    if (show)
      toast({
        title: "File removed",
        description: "The uploaded file has been cleared.",
      });

    return;
  };

  const onSubmit = async (data: ProductFormData) => {
    console.log(data);
    if (
      !data.description ||
      !data.name ||
      !data.price ||
      !data.product_type ||
      !data.file
    ) {
      toast({
        variant: "destructive",
        title: "Fill up the form",
        description: "Please fill all the required fields.",
      });
      return;
    }

    try {
      const fileUrl = await uploadFile(data);

      await createProduct(data, fileUrl);

      toast({
        title: "Form submitted",
        description: `Product details saved with file: ${data.file.name}`,
      });
      clearFile(false);
      form.reset();

      // temp fix
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Form submission error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  return (
    <div className="p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold mb-4">
                    Create new product item
                  </h2>
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter item name" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter item price"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="product_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type of Product</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select product type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(ProductType).map((type) => (
                                <SelectItem key={type} value={type}>
                                  {formatEnumText(type)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <DisplaySelectFieldTypes
                      form={form}
                      type={form.watch("product_type")}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter item description"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-4">Upload file</h2>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragActive
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <input {...getInputProps()} />
                    {uploadedFile ? (
                      <div>
                        <Check className="w-10 h-10 mx-auto mb-4 text-green-500" />
                        <p className="text-sm text-muted-foreground">
                          File uploaded successfully
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">
                          <p>Drop a file here or click to upload</p>
                          <p className="mt-1">Supported formats: PNG, JPG</p>
                        </div>
                      </>
                    )}
                  </div>
                  {uploadedFile && (
                    <Alert className="mt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <AlertDescription>{uploadedFile.name}</AlertDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => clearFile}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove file</span>
                      </Button>
                    </Alert>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => form.reset()}
                >
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
