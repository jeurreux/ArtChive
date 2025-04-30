import {z} from "zod";

        //validation for art entries 
    const title = z.string().min(1, {message: "Title is required" });
    const tags = z.array(z.string()).optional().default([]);
    const notes = z.string().optional().default(""); 
    const imageUrl = z.string().url({message: "Invalid url format"}).optional().default("");

export const artEntrySchema = z.object({
    title, tags, notes, imageUrl
});