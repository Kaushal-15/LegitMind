'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/ai-summarize-document.ts';
import '@/ai/flows/guidance-tool-upload.ts';
import '@/ai/flows/chat-with-document.ts';
import '@/ai/flows/analyze-document.ts';
