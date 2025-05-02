import {z} from "zod";

    const title = z.string().min(1, {message: "Title is required" });
    const tags = z.array(z.string()).optional().default([]);
    const notes = z.string().optional().default(""); 
    const imageUrl = z.string().url({message: "Invalid url format"}).optional().default("");

    export const artEntrySchema = z.object({
        title: z.string().min(1),
        imageUrl: z.string().url(),
        tags: z.array(z.string()),
        notes: z.string(),
        date: z.string().optional(),
        userId: z.coerce.number(),
      });
      