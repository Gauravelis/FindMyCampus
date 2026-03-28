'use server';

/**
 * @fileOverview A Genkit flow for sanitizing college data imported from a CSV file.
 *
 * - sanitizeCollegeData - A function that sanitizes college data using AI.
 * - SanitizeCollegeDataInput - The input type for the sanitizeCollegeData function.
 * - SanitizeCollegeDataOutput - The return type for the sanitizeCollegeData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SanitizeCollegeDataInputSchema = z.object({
  name: z.string().describe('The name of the college.'),
  address: z.string().describe('The address of the college.'),
  city: z.string().describe('The city where the college is located.'),
  state: z.string().describe('The state where the college is located.'),
  website: z.string().optional().describe('The website of the college.'),
  contactNumber: z.string().optional().describe('The contact number of the college.'),
  email: z.string().optional().describe('The email address of the college.'),
  description: z.string().describe('A short description of the college.'),
  longDescription: z.string().describe('A long description of the college.'),
  courses: z.array(z.object({
    name: z.string().describe('The name of the course.'),
    cutoff: z.number().describe('The cutoff percentage for the course.'),
  })).describe('An array of courses offered by the college.'),
  fees: z.number().describe('The fees for attending the college.'),
  awards: z
    .array(
      z.object({
        title: z.string().describe('The title of the award.'),
        description: z.string().describe('A description of the award.'),
        imageUrl: z.string().optional().describe('An optional image URL for the award.'),
      })
    )
    .describe('An array of awards received by the college.'),
  facilities:
    z
      .array(
        z.object({
          name: z.string().describe('The name of the facility.'),
          icon: z.string().optional().describe('An optional icon for the facility.'),
        })
      )
      .describe('An array of facilities offered by the college.'),
});

export type SanitizeCollegeDataInput = z.infer<typeof SanitizeCollegeDataInputSchema>;

const SanitizeCollegeDataOutputSchema = z.object({
  name: z.string().describe('The sanitized name of the college.'),
  address: z.string().describe('The sanitized address of the college.'),
  city: z.string().describe('The sanitized city where the college is located.'),
  state: z.string().describe('The sanitized state where the college is located.'),
  website: z.string().optional().describe('The sanitized website of the college.'),
  contactNumber: z.string().optional().describe('The sanitized contact number of the college.'),
  email: z.string().optional().describe('The sanitized email address of the college.'),
  description: z.string().describe('A short sanitized description of the college.'),
  longDescription: z.string().describe('A long sanitized description of the college.'),
  courses: z.array(z.object({
    name: z.string().describe('The sanitized name of the course.'),
    cutoff: z.number().describe('The sanitized cutoff percentage for the course.'),
  })).describe('An array of sanitized courses offered by the college.'),
  fees: z.number().describe('The sanitized fees for attending the college.'),
  awards:
    z
      .array(
        z.object({
          title: z.string().describe('The sanitized title of the award.'),
          description: z.string().describe('A sanitized description of the award.'),
          imageUrl: z.string().optional().describe('An optional image URL for the award.'),
        })
      )
      .describe('An array of sanitized awards received by the college.'),
  facilities:
    z
      .array(
        z.object({
          name: z.string().describe('The sanitized name of the facility.'),
          icon: z.string().optional().describe('An optional icon for the facility.'),
        })
      )
      .describe('An array of sanitized facilities offered by the college.'),
});

export type SanitizeCollegeDataOutput = z.infer<typeof SanitizeCollegeDataOutputSchema>;

export async function sanitizeCollegeData(
  input: SanitizeCollegeDataInput
): Promise<SanitizeCollegeDataOutput> {
  return sanitizeCollegeDataFlow(input);
}

const sanitizeCollegeDataPrompt = ai.definePrompt({
  name: 'sanitizeCollegeDataPrompt',
  input: {schema: SanitizeCollegeDataInputSchema},
  output: {schema: SanitizeCollegeDataOutputSchema},
  prompt: `You are an AI assistant that sanitizes college data to ensure data consistency and quality.

  Given the following college data, please sanitize the descriptions and course names to ensure they are accurate, consistent, and of high quality.

  College Name: {{{name}}}
  Address: {{{address}}}
  City: {{{city}}}
  State: {{{state}}}
  Website: {{{website}}}
  Contact Number: {{{contactNumber}}}
  Email: {{{email}}}
  Description: {{{description}}}
  Long Description: {{{longDescription}}}
  Courses: {{#each courses}}Name: {{{this.name}}}, Cutoff: {{{this.cutoff}}}; {{/each}}
  Fees: {{{fees}}}
  Awards: {{#each awards}}Title: {{{this.title}}}, Description: {{{this.description}}}, Image URL: {{{this.imageUrl}}}; {{/each}}
  Facilities: {{#each facilities}}Name: {{{this.name}}}, Icon: {{{this.icon}}}; {{/each}}

  Ensure that the output data is well-formatted and suitable for storage in a database.
  Do not modify location data such as city, state, or address.
  `,
});

const sanitizeCollegeDataFlow = ai.defineFlow(
  {
    name: 'sanitizeCollegeDataFlow',
    inputSchema: SanitizeCollegeDataInputSchema,
    outputSchema: SanitizeCollegeDataOutputSchema,
  },
  async input => {
    const {output} = await sanitizeCollegeDataPrompt(input);
    return output!;
  }
);
