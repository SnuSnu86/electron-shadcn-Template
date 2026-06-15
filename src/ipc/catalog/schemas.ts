import { z } from "zod";

export const criticalitySchema = z.enum(["low", "medium", "high"]);
export const frequencySchema = z.enum([
  "adhoc",
  "daily",
  "weekly",
  "monthly",
  "ondemand",
]);
export const processStatusSchema = z.enum([
  "active",
  "deprecated",
  "maintenance",
]);
export const actionTypeSchema = z.enum(["shell", "pad", "cloudflow", "file"]);
export const paramTypeSchema = z.enum([
  "string",
  "number",
  "date",
  "boolean",
  "enum",
]);

export const processFilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  criticality: criticalitySchema.optional(),
  status: processStatusSchema.optional(),
  tag: z.string().optional(),
  favoritesOnly: z.boolean().optional(),
});

export const businessInfoSchema = z.object({
  istProcess: z.string(),
  sollProcess: z.string(),
  benefit: z.string(),
});

export const techInfoSchema = z.object({
  flows: z.array(
    z.object({
      name: z.string(),
      kind: z.string(),
      link: z.string().optional(),
    })
  ),
  files: z.array(z.object({ path: z.string(), purpose: z.string() })),
  systems: z.array(
    z.object({ name: z.string(), detail: z.string().optional() })
  ),
  notes: z.string().optional(),
});

export const runbookSchema = z.object({
  whenToUse: z.string(),
  prerequisites: z.array(z.string()),
  steps: z.array(z.string()),
  expectedResults: z.array(z.string()),
  errors: z.array(
    z.object({
      problem: z.string(),
      solution: z.string(),
      escalation: z.string().optional(),
    })
  ),
});

export const diagramSchema = z.object({
  nodes: z.array(
    z.object({
      id: z.string(),
      kind: z.enum(["start", "input", "system", "decision", "output", "end"]),
      label: z.string(),
      sublabel: z.string().optional(),
    })
  ),
  edges: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
      label: z.string().optional(),
    })
  ),
});

export const actionSchema = z.object({
  type: actionTypeSchema,
  command: z.string().optional(),
  cwd: z.string().optional(),
  url: z.string().optional(),
  method: z.enum(["POST", "GET"]).optional(),
  headers: z.record(z.string(), z.string()).optional(),
  bodyTemplate: z.string().optional(),
  filePath: z.string().optional(),
  padFlowName: z.string().optional(),
  padUrl: z.string().optional(),
});

export const processInputSchema = z.object({
  name: z.string().min(1),
  descriptionShort: z.string(),
  descriptionLong: z.string(),
  businessOwner: z.string(),
  technicalOwner: z.string(),
  category: z.string().min(1),
  criticality: criticalitySchema,
  frequency: frequencySchema,
  status: processStatusSchema,
  systems: z.array(z.string()),
  tags: z.array(z.string()),
  business: businessInfoSchema,
  tech: techInfoSchema,
  runbook: runbookSchema,
  diagram: diagramSchema,
  action: actionSchema,
});

export const idSchema = z.object({ id: z.number().int().positive() });

export const updateProcessSchema = z.object({
  id: z.number().int().positive(),
  input: processInputSchema,
});

export const parameterInputSchema = z.object({
  id: z.number().int().positive().optional(),
  processId: z.number().int().positive(),
  name: z.string().min(1),
  key: z
    .string()
    .min(1)
    .regex(/^\w+$/, "Nur Buchstaben, Zahlen und Unterstrich"),
  type: paramTypeSchema,
  defaultValue: z.string(),
  required: z.boolean(),
  group: z.string(),
  description: z.string(),
  options: z.array(z.string()),
  sortOrder: z.number().int(),
});

export const technicalArtifactInputSchema = z.object({
  processId: z.number().int().positive(),
  artifacts: z.array(
    z.object({
      sortOrder: z.number().int(),
      kind: z.enum(["Power Automate Desktop", "Excel VBA", "SAP VBScript"]),
      title: z.string().min(1),
      description: z.string(),
      language: z.string(),
      code: z.string(),
      source: z.string(),
    })
  ),
});
