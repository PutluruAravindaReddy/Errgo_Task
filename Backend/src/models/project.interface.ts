import { z } from "zod";

/**
 * BONUS: Implement zod schema for model validation
 */

export const ProjectInputSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Project description is required"),
});

export interface IProject {
    id: string;
    name: string;
    description: string;
}