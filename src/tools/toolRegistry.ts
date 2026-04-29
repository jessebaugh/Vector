import { fileWriterTool } from "./fileWriterTool";
import { fileReaderTool } from "./fileReaderTool";
import { fileUpdaterTool } from "./fileUpdaterTool";
import { webSearchTool } from "./webSearchTool";
import { saveMemory } from "./memoryTool";
import { skipTool } from "./skipTool";
import { flakyTool } from "./flakyTool";

export interface ToolDefinition {
  handler: (...args: any[]) => Promise<any>;
  requiredFields: string[];
  optionalFields?: string[];
}

export interface ToolRegistry {
  [key: string]: ToolDefinition;
}

export const toolRegistry: ToolRegistry = {
  fileWriterTool: {
    handler: fileWriterTool,
    requiredFields: ["filename", "content"]
  },

  fileReaderTool: {
    handler: fileReaderTool,
    requiredFields: ["filename"]
  },

  fileUpdaterTool: {
    handler: fileUpdaterTool,
    requiredFields: ["filename", "content"],
    optionalFields: ["mode"]
  },

  webSearchTool: {
    handler: webSearchTool,
    requiredFields: ["query"]
  },

  saveMemory: {
    handler: saveMemory,
    requiredFields: ["key", "value"]
  },

  flakyTool: {
    handler: flakyTool,
    requiredFields: []
  },

  skipTool: {
    handler: skipTool,
    requiredFields: []
  }
};
