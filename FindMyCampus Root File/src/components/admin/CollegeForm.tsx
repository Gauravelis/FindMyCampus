'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { College } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X, Plus, Loader2, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createCollege, updateCollege } from '@/lib/actions';
import { ScrollArea } from '../ui/scroll-area';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useDropzone } from 'react-dropzone';

const isDataUrl = (url: string) => url.startsWith('data:image');
const isHttpUrl = (url: string) => url.startsWith('http');

const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  address: z.string().min(5, 'Address is required.'),
  city: z.string().min(2, 'City is required.'),
  state: z.string().min(2, 'State is required.'),
  website: z.string().url().optional().or(z.literal('')),
  contactNumber: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  description: z.string().min(10, 'Short description is required.'),
  longDescription: z.string().min(50, 'Long description is required.'),
  fees: z.coerce.number().min(0, 'Fees must be a positive number.'),
  courses: z.array(z.object({ 
    name: z.string().min(1, 'Course name cannot be empty.'),
    cutoff: z.coerce.number().min(0).max(100, 'Cutoff must be between 0 and 100'),
  })),
  facilities: z.array(z.object({ name: z.string().min(1), icon: z.string().min(1) })),
  awards: z.array(z.object({ title: z.string().min(1), description: z.string().min(1), imageUrl: z.string().optional().or(z.literal('')) })),
  heroImageUrl: z.string().refine(val => val && (isDataUrl(val) || isHttpUrl(val)), { message: 'Please upload a valid hero image.' }),
  galleryImageUrls: z.array(z.string().refine(val => val && (isDataUrl(val) || isHttpUrl(val)))),
});

type CollegeFormValues = z.infer<typeof formSchema>;

interface CollegeFormProps {
  college?: College;
}

const FileUploader = ({ onFileUpload, children, className }: { onFileUpload: (url: string) => void, children: React.ReactNode, className?: string }) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    onFileUpload(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    }, [onFileUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.gif', '.webp'] },
        multiple: false,
    });

    return (
        <div {...getRootProps()} className={cn(
            "border-2 border-dashed rounded-md cursor-pointer hover:border-primary transition-colors",
            isDragActive && "border-primary bg-primary/10",
            className
        )}>
            <input {...getInputProps()} />
            {children}
        </div>
    );
};


export default function CollegeForm({ college }: CollegeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  
  const defaultValues: Partial<CollegeFormValues> = college ? {
      ...college,
      courses: college.courses || [],
      facilities: college.facilities || [],
      awards: college.awards || [],
  } : {
      name: '',
      address: '',
      city: '',
      state: '',
      website: '',
      contactNumber: '',
      email: '',
      description: '',
      longDescription: '',
      fees: 0,
      courses: [{name: '', cutoff: 0}],
      facilities: [{name: '', icon: 'Building'}],
      awards: [{title: '', description: '', imageUrl: ''}],
      heroImageUrl: '',
      galleryImageUrls: [],
  };

  const form = useForm<CollegeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields: courseFields, append: appendCourse, remove: removeCourse } = useFieldArray({ control: form.control, name: "courses" });
  const { fields: facilityFields, append: appendFacility, remove: removeFacility } = useFieldArray({ control: form.control, name: "facilities" });
  const { fields: awardFields, append: appendAward, remove: removeAward } = useFieldArray({ control: form.control, name: "awards" });
  const { fields: galleryFields, append: appendGallery, remove: removeGallery } = useFieldArray({ control: form.control, name: "galleryImageUrls" });
  
  async function onSubmit(data: CollegeFormValues) {
    setIsLoading(true);
    try {
      if (college) {
        await updateCollege(college.id, data);
        toast({
            title: `College Updated`,
            description: `${data.name} has been successfully saved.`,
        });
      } else {
        const newCollege = await createCollege(data);
        toast({
            title: `College Created`,
            description: `${data.name} has been successfully saved.`,
        });
        router.push(`/admin/colleges/edit/${newCollege.id}`);
      }
      router.refresh();
    } catch (error) {
       toast({
            variant: "destructive",
            title: `Error`,
            description: 'Something went wrong while saving the college.',
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>College Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="fees" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Annual Fees</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField name="address" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="city" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="state" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <FormField name="website" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Website</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="contactNumber" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Contact Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="email" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <FormField name="description" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Short Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField name="longDescription" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Long Description</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <Separator />

            <div className="space-y-4">
                <h3 className="text-lg font-medium font-headline">Images</h3>
                 <FormField
                    name="heroImageUrl"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hero Image</FormLabel>
                            <FormControl>
                                <FileUploader onFileUpload={field.onChange} className="w-full h-40">
                                    {field.value ? (
                                        <div className="w-full h-full relative">
                                            <Image src={field.value} alt="Hero image preview" fill className="object-contain rounded-md" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <p className="text-white font-semibold">Change Image</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                            <UploadCloud className="h-10 w-10" />
                                            <p className="mt-2 text-sm">Drag & drop or click to upload</p>
                                        </div>
                                    )}
                                </FileUploader>
                            </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <div>
                    <h4 className="text-md font-medium mb-2">Gallery Images</h4>
                     <div className="grid grid-cols-3 gap-4">
                        {galleryFields.map((field, index) => (
                            <FormField
                                key={field.id}
                                control={form.control}
                                name={`galleryImageUrls.${index}`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative group">
                                                <FileUploader onFileUpload={field.onChange} className="aspect-video">
                                                     {field.value ? (
                                                        <div className="w-full h-full relative">
                                                            <Image src={field.value} alt={`Gallery image ${index+1}`} fill className="object-contain rounded-md" />
                                                        </div>
                                                     ) : (
                                                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                                          <ImageIcon className="h-8 w-8"/>
                                                        </div>
                                                     )}
                                                </FileUploader>
                                                <Button type="button" variant="destructive" size="icon" onClick={() => removeGallery(index)} className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                         <Button type="button" variant="outline" onClick={() => appendGallery('')} className="aspect-video flex-col gap-2 h-full">
                            <Plus className="h-6 w-6"/>
                            Add Image
                        </Button>
                     </div>
                </div>
            </div>

            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium font-headline">Courses</h3>
              {courseFields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2 p-4 border rounded-lg">
                  <div className="grid grid-cols-2 gap-4 flex-grow">
                      <FormField name={`courses.${index}.name`} control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField name={`courses.${index}.cutoff`} control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Cutoff (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                  </div>
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeCourse(index)} className="mt-8"><X className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => appendCourse({name: '', cutoff: 0})}><Plus className="mr-2 h-4 w-4"/>Add Course</Button>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium font-headline">Facilities</h3>
              {facilityFields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2 p-4 border rounded-lg">
                  <div className="grid grid-cols-2 gap-4 flex-grow">
                      <FormField name={`facilities.${index}.name`} control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField name={`facilities.${index}.icon`} control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Lucide Icon Name</FormLabel><FormControl><Input {...field} /></FormControl><FormDescription>e.g., Library, BedDouble</FormDescription><FormMessage /></FormItem>
                      )} />
                  </div>
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeFacility(index)} className="mt-8"><X className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => appendFacility({name: '', icon: ''})}><Plus className="mr-2 h-4 w-4"/>Add Facility</Button>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium font-headline">Awards</h3>
               {awardFields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="space-y-4 flex-grow">
                      <FormField name={`awards.${index}.title`} control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField name={`awards.${index}.description`} control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField
                        control={form.control}
                        name={`awards.${index}.imageUrl`}
                        render={({ field }) => (
                           <FormItem>
                                <FormLabel>Image (Optional)</FormLabel>
                                <FormControl>
                                    <FileUploader onFileUpload={field.onChange} className="w-48 h-24">
                                        {field.value ? (
                                           <div className="w-full h-full relative">
                                                <Image src={field.value} alt="Award image preview" fill className="object-contain rounded-md" />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs text-center">
                                                <ImageIcon className="h-6 w-6" />
                                                <span className="mt-1">Upload Award Image</span>
                                            </div>
                                        )}
                                    </FileUploader>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                      />
                  </div>
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeAward(index)} className="mt-8"><X className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => appendAward({title: '', description: '', imageUrl: ''})}><Plus className="mr-2 h-4 w-4"/>Add Award</Button>
            </div>
            
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                {college ? 'Update College' : 'Create College'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
