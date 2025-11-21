// src/api/LaptopsApi/addLaptop.ts
import type { AxiosError } from 'axios';
import client from '@shared/api/client';

export type AddLaptopDTO = {
  serialNumber: string;
  dealer: string;
  model: string;
  brand: string;
  price: number;

  warrantyInYear: number;
  processor: string;
  processorBrand: string;

  memoryType: string;
  screenSize: string;
  colour: string;

  ram: string;
  storage: string;

  battery: string;
  batteryLife: string;

  graphicsCard: string;
  graphicBrand: string;

  weight: string;
  manufacturer: string;
  usbPorts: number;

  /** Backend sample includes this; keep UPPERCASE */
  status?: 'ACTIVE' | 'AVAILABLE' | 'DELETED' | 'DEACTIVATE' | 'PENDING' | 'SOLD';

  /** Required */
  sellerId: number;
};

export type AddLaptopResponse = {
  status?: string;        // e.g. "SUCCESS"
  message?: string;       // e.g. "Laptop created"
  code?: string;          // e.g. "CREATED"
  statusCode?: number;    // e.g. 200/201
  timeStamp?: string;
  apiPath?: string;
  imageUrl?: string | null;
  laptopId?: number;
  [k: string]: any;
};

type LaptopPayloadKey = keyof AddLaptopDTO;

export type LaptopFieldIssue = { field: LaptopPayloadKey | 'payload'; message: string };

export class LaptopPayloadError extends Error {
  readonly issues: LaptopFieldIssue[];
  readonly statusCode?: number;
  readonly response?: AxiosError['response'];
  readonly originalError?: AxiosError;

  constructor(
    message: string,
    issues: LaptopFieldIssue[] = [],
    statusCode?: number,
    response?: AxiosError['response'],
    originalError?: AxiosError,
  ) {
    super(message);
    this.name = 'LaptopPayloadError';
    this.issues = issues;
    this.statusCode = statusCode;
    this.response = response;
    if (originalError) {
      this.originalError = originalError;
      if (!(this as any).cause) {
        (this as any).cause = originalError;
      }
    }
    Object.setPrototypeOf(this, LaptopPayloadError.prototype);
  }
}

const LAPTOP_ALLOWED_KEYS = [
  'serialNumber',
  'dealer',
  'model',
  'brand',
  'price',
  'warrantyInYear',
  'processor',
  'processorBrand',
  'memoryType',
  'screenSize',
  'colour',
  'ram',
  'storage',
  'battery',
  'batteryLife',
  'graphicsCard',
  'graphicBrand',
  'weight',
  'manufacturer',
  'usbPorts',
  'status',
  'sellerId',
] as const;

const LAPTOP_ALLOWED_KEY_SET = new Set<LaptopPayloadKey>(LAPTOP_ALLOWED_KEYS);

const LAPTOP_ALLOWED_STATUSES = ['ACTIVE', 'AVAILABLE', 'DELETED', 'DEACTIVATE', 'PENDING', 'SOLD'] as const;
const LAPTOP_STATUS_SET = new Set<string>(LAPTOP_ALLOWED_STATUSES);
const ALLOWED_STATUS_LIST = LAPTOP_ALLOWED_STATUSES.join(', ');

const WEIGHT_PATTERN = /^((?:0?\.\d*[1-9]\d*)|(?:[1-9]\d*(?:\.\d+)?))\s?kg$/i;

const FIELD_LABELS: Record<LaptopPayloadKey, string> = {
  serialNumber: 'Serial number',
  dealer: 'Dealer',
  model: 'Model',
  brand: 'Brand',
  price: 'Price',
  warrantyInYear: 'Warranty (years)',
  processor: 'Processor',
  processorBrand: 'Processor brand',
  memoryType: 'Memory type',
  screenSize: 'Screen size',
  colour: 'Colour',
  ram: 'RAM',
  storage: 'Storage',
  battery: 'Battery',
  batteryLife: 'Battery life',
  graphicsCard: 'Graphics card',
  graphicBrand: 'Graphics brand',
  weight: 'Weight',
  manufacturer: 'Manufacturer',
  usbPorts: 'USB ports',
  status: 'Status',
  sellerId: 'Seller',
};

const TEXT_FIELDS = [
  'serialNumber',
  'dealer',
  'model',
  'brand',
  'processor',
  'processorBrand',
  'memoryType',
  'screenSize',
  'colour',
  'ram',
  'storage',
  'battery',
  'batteryLife',
  'graphicsCard',
  'graphicBrand',
  'weight',
  'manufacturer',
] as const;

type LaptopStringField = typeof TEXT_FIELDS[number];

const NUMERIC_FIELDS = ['price', 'warrantyInYear', 'usbPorts', 'sellerId'] as const;

type LaptopNumericField = typeof NUMERIC_FIELDS[number];

const SERIAL_PATTERN = /^[A-Za-z0-9-]+$/;
const LETTER_DIGIT_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 .-]*$/;
const LETTER_ONLY_PATTERN = /^[A-Za-z][A-Za-z .-]*$/;
const LETTERS_WITH_SPACE_PATTERN = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;  // Only letters and spaces (e.g., "Metallic Grey")
const SCREEN_SIZE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 ."\-]*$/;
const BATTERY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 .,\-]*$/;
const BATTERY_LIFE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 .,\-]*$/;

interface TextRule {
  required?: boolean;
  maxLength?: number;  // Optional: may be frontend-only
  frontendOnlyMaxLength?: boolean;  // Marks maxLength as UX guardrail, not server rule
  pattern?: RegExp;
  patternMessage?: string;
  frontendOnlyPattern?: boolean;  // Marks pattern as UX guardrail, not server rule
  mustContainLetter?: boolean;
  mustContainDigit?: boolean;
  casing?: 'title' | 'upper';
  enforceKg?: boolean;
}

interface NumberRule {
  required: boolean;
  min?: number;
  frontendOnlyMin?: boolean;  // Marks min as UX guardrail, not server rule
  max?: number;
  frontendOnlyMax?: boolean;  // Marks max as UX guardrail, not server rule
  integer?: boolean;
}

const TEXT_RULES: Record<LaptopStringField, TextRule> = {
  // Backend: @NotBlank + @Size(max=30) + @Pattern(^[A-Za-z0-9\-]+$)
  serialNumber: {
    required: true,
    maxLength: 30,
    pattern: SERIAL_PATTERN,
    patternMessage: 'Serial number may include letters, numbers, and "-" only.',
    casing: 'upper',
  },
  // Backend: @NotBlank + @Size(max=50) + @Pattern(letters only)
  dealer: {
    required: true,
    maxLength: 50,
    pattern: LETTER_ONLY_PATTERN,
    patternMessage: 'Dealer may include letters, spaces, ".", and "-" only.',
    mustContainLetter: true,
    casing: 'title',
  },
  // Backend: @NotBlank + @Size(max=50) + @Pattern(letters & digits)
  model: {
    required: true,
    maxLength: 50,
    pattern: LETTER_DIGIT_PATTERN,
    patternMessage: 'Model may include letters, numbers, spaces, ".", and "-" only.',
    mustContainLetter: true,
  },
  // Backend: @NotBlank + @Size(max=50) + @Pattern(letters only)
  brand: {
    required: true,
    maxLength: 50,
    pattern: LETTER_ONLY_PATTERN,
    patternMessage: 'Brand may include letters, spaces, ".", and "-" only.',
    mustContainLetter: true,
    casing: 'title',
  },
  // Backend: @NotBlank + @Size(max=50) + @Pattern(letters & digits)
  processor: {
    required: true,
    maxLength: 50,
    pattern: LETTER_DIGIT_PATTERN,
    patternMessage: 'Processor may include letters, numbers, spaces, ".", and "-" only.',
    mustContainLetter: true,
  },
  // Backend: @NotBlank + @Size(max=50) + @Pattern(letters & digits)
  processorBrand: {
    required: true,
    maxLength: 50,
    pattern: LETTER_DIGIT_PATTERN,
    patternMessage: 'Processor brand may include letters, numbers, spaces, ".", and "-" only.',
    mustContainLetter: true,
    casing: 'title',
  },
  // Backend: @NotBlank + @Size(max=50) + @Pattern(letters & digits)
  memoryType: {
    required: true,
    maxLength: 50,
    pattern: LETTER_DIGIT_PATTERN,
    patternMessage: 'Memory type may include letters, numbers, spaces, ".", and "-" only.',
    mustContainLetter: true,
  },
  // Backend: @NotBlank + @Size(max=20) only (no pattern)
  screenSize: {
    required: true,
    maxLength: 20,
    // Frontend-only UX pattern (not enforced by server)
    pattern: SCREEN_SIZE_PATTERN,
    patternMessage: 'Screen size may include letters, numbers, spaces, ".", "-", and quotes.',
    frontendOnlyPattern: true,
  },
  // Backend: @NotBlank + @Size(max=50) + @Pattern(letters only)
  colour: {
    required: true,
    maxLength: 50,
    pattern: LETTERS_WITH_SPACE_PATTERN,
    patternMessage: 'Colour must contain only letters and spaces (e.g., "Metallic Grey").',
    mustContainLetter: true,
    casing: 'title',
  },
  // Backend: @NotBlank + @Pattern(letters & digits only) - no @Size
  ram: {
    required: true,
    maxLength: 30,  // Frontend-only UX limit (not enforced by server)
    frontendOnlyMaxLength: true,
    pattern: LETTER_DIGIT_PATTERN,
    patternMessage: 'RAM may include letters, numbers, spaces, ".", and "-" only.',
    mustContainLetter: true,
  },
  // Backend: @NotBlank + @Size(max=30) + @Pattern(letters & digits)
  storage: {
    required: true,
    maxLength: 30,  // Fixed: was 50, backend has @Size(max=30)
    pattern: LETTER_DIGIT_PATTERN,
    patternMessage: 'Storage may include letters, numbers, spaces, ".", and "-" only.',
    mustContainLetter: true,
  },
  // Backend: @NotBlank only (no @Size, no pattern)
  battery: {
    required: true,
    maxLength: 60,  // Frontend-only UX limit (not enforced by server)
    frontendOnlyMaxLength: true,
    pattern: BATTERY_PATTERN,  // Frontend-only UX pattern (not enforced by server)
    patternMessage: 'Battery may include letters, numbers, spaces, ".", ",", and "-" only.',
    frontendOnlyPattern: true,
    mustContainLetter: true,
  },
  // Backend: @NotBlank + @Pattern(must have letters & digits) - no @Size
  batteryLife: {
    required: true,
    maxLength: 60,  // Frontend-only UX limit (not enforced by server)
    frontendOnlyMaxLength: true,
    pattern: BATTERY_LIFE_PATTERN,
    patternMessage: 'Battery life may include letters, numbers, spaces, ".", ",", and "-" only.',
    mustContainLetter: true,
    mustContainDigit: true,
  },
  // Backend: @NotBlank + @Size(max=30) + @Pattern(letters & digits)
  graphicsCard: {
    required: true,
    maxLength: 30,
    pattern: LETTER_DIGIT_PATTERN,
    patternMessage: 'Graphics card may include letters, numbers, spaces, ".", and "-" only.',
    mustContainLetter: true,
  },
  // Backend: @NotBlank + @Size(max=50) + @Pattern(letters only)
  graphicBrand: {
    required: true,
    maxLength: 50,
    pattern: LETTER_ONLY_PATTERN,
    patternMessage: 'Graphics brand may include letters, spaces, ".", and "-" only.',
    mustContainLetter: true,
    casing: 'title',
  },
  // Backend: @NotBlank + @Pattern(must be >0 with "kg" suffix) - no @Size, no rounding requirement
  weight: {
    required: true,
    maxLength: 20,  // Frontend-only UX limit (not enforced by server)
    frontendOnlyMaxLength: true,
    enforceKg: true,  // Backend pattern enforced: positive number + " kg"
  },
  // Backend: @NotBlank + @Size(max=50) + @Pattern(letters only)
  manufacturer: {
    required: true,
    maxLength: 50,
    pattern: LETTER_ONLY_PATTERN,
    patternMessage: 'Manufacturer may include letters, spaces, ".", and "-" only.',
    mustContainLetter: true,
    casing: 'title',
  },
};

const NUMBER_RULES: Record<LaptopNumericField, NumberRule> = {
  // Backend: @NotNull + @Positive only (no upper bound)
  price: {
    required: true,
    min: 1,
    max: 10_000_000,  // Frontend-only UX guardrail (not enforced by server)
    frontendOnlyMax: true,
  },
  // Backend: @NotNull Long only (no min/max)
  warrantyInYear: {
    required: true,
    min: 0,  // Frontend-only: allows 0 years warranty
    frontendOnlyMin: true,
    integer: true,
  },
  // Backend: @NotNull + @Min(1) only
  usbPorts: {
    required: true,
    min: 1,
    max: 10,  // Frontend-only UX guardrail (not enforced by server)
    frontendOnlyMax: true,
    integer: true,
  },
  // Backend: @NotNull + @Min(1)
  sellerId: { required: true, min: 1, integer: true },
};

const stripInvalidAscii = (value: string): string => value.replace(/[^\x20-\x7E]/g, '');

const collapseWhitespace = (value: string): string => value.replace(/\s+/g, ' ').trim();

const toTitleCasePreservingAcronyms = (value: string): string =>
  value
    .split(/\s+/)
    .map((word) =>
      word
        .split(/([\-\/'])/)
        .map((segment) => {
          if (segment === '-' || segment === '/' || segment === "'") {
            return segment;
          }
          if (!segment) {
            return segment;
          }
          if (/^[A-Za-z]+$/.test(segment) && segment.length <= 3) {
            if (segment === segment.toLowerCase()) {
              return segment.toUpperCase();
            }
            if (segment === segment.toUpperCase()) {
              return segment;
            }
          }
          if (/^[A-Z0-9]+$/.test(segment)) {
            return segment.toUpperCase();
          }
          return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
        })
        .join(''),
    )
    .join(' ');

const normalizeWeight = (value: string, issues: LaptopFieldIssue[]): string | undefined => {
  const label = FIELD_LABELS.weight;
  const trimmed = collapseWhitespace(stripInvalidAscii(value));
  if (!trimmed) {
    return undefined;
  }

  const match = trimmed.match(/^(.+?)\s*kg$/i);
  if (!match) {
    issues.push({ field: 'weight', message: `${label} must end with "kg".` });
    return undefined;
  }

  const numericPortion = match[1].trim();
  const parsed = Number.parseFloat(numericPortion);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    issues.push({ field: 'weight', message: `${label} must be greater than zero.` });
    return undefined;
  }

  const rounded = Math.round(parsed * 1000) / 1000;
  const normalizedValue = Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toString();
  const normalized = `${normalizedValue} kg`;

  if (!WEIGHT_PATTERN.test(normalized)) {
    issues.push({ field: 'weight', message: `${label} must match the format "1.5 kg".` });
    return undefined;
  }

  return normalized;
};

const sanitizeStringField = (
  field: LaptopStringField,
  input: unknown,
  rule: TextRule,
  issues: LaptopFieldIssue[],
): string | undefined => {
  const label = FIELD_LABELS[field];

  if (input == null) {
    if (rule.required) {
      issues.push({ field, message: `${label} is required.` });
    }
    return undefined;
  }

  const raw =
    typeof input === 'string'
      ? input
      : typeof input === 'number' || typeof input === 'boolean'
      ? String(input)
      : '';

  let sanitized = collapseWhitespace(stripInvalidAscii(raw));
  if (!sanitized) {
    if (rule.required) {
      issues.push({ field, message: `${label} is required.` });
    }
    return undefined;
  }

  if (rule.enforceKg) {
    const normalizedWeight = normalizeWeight(sanitized, issues);
    if (normalizedWeight && rule.maxLength && normalizedWeight.length > rule.maxLength) {
      issues.push({
        field,
        message: `${label} must be ${rule.maxLength} characters or fewer.`,
      });
      return undefined;
    }
    return normalizedWeight;
  }

  if (rule.maxLength && sanitized.length > rule.maxLength) {
    issues.push({
      field,
      message: `${label} must be ${rule.maxLength} characters or fewer.`,
    });
    return undefined;
  }

  if (rule.pattern && !rule.pattern.test(sanitized)) {
    issues.push({
      field,
      message: rule.patternMessage || `${label} contains unsupported characters.`,
    });
    return undefined;
  }

  if (rule.mustContainLetter && !/[A-Za-z]/.test(sanitized)) {
    issues.push({
      field,
      message: `${label} must contain at least one letter.`,
    });
    return undefined;
  }

  if (rule.mustContainDigit && !/\d/.test(sanitized)) {
    issues.push({
      field,
      message: `${label} must contain at least one number.`,
    });
    return undefined;
  }

  if (rule.casing === 'title') {
    sanitized = toTitleCasePreservingAcronyms(sanitized);
  } else if (rule.casing === 'upper') {
    sanitized = sanitized.toUpperCase();
  }

  return sanitized;
};

const sanitizeNumberField = (
  field: LaptopNumericField,
  input: unknown,
  rule: NumberRule,
  issues: LaptopFieldIssue[],
): number | undefined => {
  const label = FIELD_LABELS[field];

  if (input == null || (typeof input === 'string' && input.trim().length === 0)) {
    if (rule.required) {
      issues.push({ field, message: `${label} is required.` });
    }
    return undefined;
  }

  const parsed =
    typeof input === 'number'
      ? input
      : Number.parseFloat(String(input).trim());

  if (!Number.isFinite(parsed)) {
    issues.push({ field, message: `${label} must be a valid number.` });
    return undefined;
  }

  if (rule.integer && !Number.isInteger(parsed)) {
    issues.push({ field, message: `${label} must be a whole number.` });
    return undefined;
  }

  if (rule.min !== undefined && parsed < rule.min) {
    issues.push({ field, message: `${label} must be at least ${rule.min}.` });
    return undefined;
  }

  if (rule.max !== undefined && parsed > rule.max) {
    issues.push({ field, message: `${label} must be at most ${rule.max}.` });
    return undefined;
  }

  return parsed;
};

const sanitizeStatus = (
  value: AddLaptopDTO['status'] | string | undefined,
  issues: LaptopFieldIssue[],
): AddLaptopDTO['status'] | undefined => {
  if (value == null) {
    return undefined;
  }

  const normalized = collapseWhitespace(stripInvalidAscii(String(value))).toUpperCase();
  if (!normalized) {
    return undefined;
  }

  if (LAPTOP_STATUS_SET.has(normalized)) {
    return normalized as AddLaptopDTO['status'];
  }

  issues.push({
    field: 'status',
    message: `${FIELD_LABELS.status} must be one of ${ALLOWED_STATUS_LIST}.`,
  });

  return undefined;
};

const normalizeBackendField = (value: unknown): LaptopPayloadKey | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const cleaned = value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!cleaned) {
    return undefined;
  }
  return LAPTOP_ALLOWED_KEYS.find(
    (key) => key.toLowerCase().replace(/[^a-z0-9]/g, '') === cleaned,
  );
};

const dedupeIssues = (issues: LaptopFieldIssue[]): LaptopFieldIssue[] => {
  const seen = new Set<string>();
  return issues.filter((issue) => {
    const key = `${issue.field}|${issue.message}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

const buildValidationError = (issues: LaptopFieldIssue[]): LaptopPayloadError => {
  const deduped = dedupeIssues(issues);
  if (deduped.length === 0) {
    return new LaptopPayloadError('Laptop payload validation failed.');
  }
  const summary =
    deduped.length === 1
      ? deduped[0].message
      : `Please review the highlighted fields:\n${deduped
          .slice(0, 3)
          .map((issue) => `• ${issue.message}`)
          .join('\n')}`;
  return new LaptopPayloadError(summary, deduped);
};

const parseBackendFieldErrors = (data: any): LaptopFieldIssue[] => {
  if (!data || typeof data !== 'object') {
    return [];
  }

  const collections = [data.errors, data.fieldErrors, data.violations, data.details];
  const issues: LaptopFieldIssue[] = [];

  for (const collection of collections) {
    if (!Array.isArray(collection)) {
      continue;
    }
    for (const item of collection) {
      if (!item || typeof item !== 'object') {
        continue;
      }

      const fieldCandidate =
        typeof (item as any).field === 'string'
          ? (item as any).field
          : typeof (item as any).path === 'string'
          ? (item as any).path
          : typeof (item as any).property === 'string'
          ? (item as any).property
          : typeof (item as any).propertyPath === 'string'
          ? (item as any).propertyPath
          : undefined;

      const messageCandidate = [
        (item as any).defaultMessage,
        (item as any).message,
        (item as any).errorMessage,
        (item as any).description,
      ].find((candidate) => typeof candidate === 'string' && candidate.trim().length > 0);

      if (!messageCandidate) {
        continue;
      }

      const normalizedMessage = collapseWhitespace(stripInvalidAscii(messageCandidate));
      if (!normalizedMessage) {
        continue;
      }

      const normalizedField = normalizeBackendField(fieldCandidate);

      issues.push({
        field: normalizedField ?? 'payload',
        message: normalizedMessage,
      });
    }
  }

  return dedupeIssues(issues);
};

const mapBackendMessage = (
  message: string,
): { message: string; field?: LaptopPayloadKey } | undefined => {
  const normalized = collapseWhitespace(stripInvalidAscii(message));
  if (!normalized) {
    return undefined;
  }

  const lower = normalized.toLowerCase();

  if (lower.includes('serial') && lower.includes('exist')) {
    return { message: 'This serial number is already listed.', field: 'serialNumber' };
  }

  if (lower.includes('graphics brand') && lower.includes('letter')) {
    return { message: 'Graphics brand must contain letters only.', field: 'graphicBrand' };
  }

  if (lower.includes('graphics card') && lower.includes('letter')) {
    return { message: 'Graphics card must contain letters.', field: 'graphicsCard' };
  }

  if (lower.includes('brand') && lower.includes('letter')) {
    return { message: 'Brand must contain letters.', field: 'brand' };
  }

  if (lower.includes('price') && lower.includes('greater')) {
    return { message: 'Price must be greater than zero.', field: 'price' };
  }

  return undefined;
};

const createLaptopErrorFromAxios = (
  axiosError: AxiosError,
  message: string,
  issues: LaptopFieldIssue[] = [],
): LaptopPayloadError =>
  new LaptopPayloadError(
    message,
    dedupeIssues(issues),
    axiosError.response?.status,
    axiosError.response,
    axiosError,
  );

const throwEnhancedLaptopAxiosError = (error: AxiosError): never => {
  const data = error.response?.data as any;
  const status = error.response?.status;
  const issues = parseBackendFieldErrors(data);

  if (status === 409) {
    const friendly = 'This serial number is already listed.';
    const mappedIssues = dedupeIssues([...issues, { field: 'serialNumber', message: friendly }]);
    throw createLaptopErrorFromAxios(error, friendly, mappedIssues);
  }

  if (issues.length > 0) {
    const friendly =
      issues.length === 1
        ? issues[0].message
        : `Please review the highlighted fields:\n${issues
            .slice(0, 3)
            .map((issue) => `• ${issue.message}`)
            .join('\n')}`;
    throw createLaptopErrorFromAxios(error, friendly, issues);
  }

  const backendMessage =
    typeof data?.message === 'string'
      ? data.message
      : typeof data?.errorMessage === 'string'
      ? data.errorMessage
      : typeof data?.error === 'string'
      ? data.error
      : undefined;

  if (backendMessage) {
    const mapped = mapBackendMessage(backendMessage);
    if (mapped) {
      const mappedIssues = mapped.field
        ? dedupeIssues([...issues, { field: mapped.field, message: mapped.message }])
        : issues;
      throw createLaptopErrorFromAxios(error, mapped.message, mappedIssues);
    }
  }

  throw error;
};

const isAxiosErrorInstance = (error: unknown): error is AxiosError =>
  Boolean((error as AxiosError)?.isAxiosError);

const sanitizeAddLaptopPayload = (payload: AddLaptopDTO): AddLaptopDTO => {
  if (payload == null || typeof payload !== 'object') {
    throw buildValidationError([{ field: 'payload', message: 'Laptop payload is required.' }]);
  }

  const issues: LaptopFieldIssue[] = [];

  for (const key of Object.keys(payload as Record<string, unknown>)) {
    if (!LAPTOP_ALLOWED_KEY_SET.has(key as LaptopPayloadKey)) {
      issues.push({
        field: 'payload',
        message: `Unexpected field "${key}" is not allowed.`,
      });
    }
  }

  const sanitized: Partial<AddLaptopDTO> = {};

  for (const field of TEXT_FIELDS) {
    const rule = TEXT_RULES[field];
    const sanitizedValue = sanitizeStringField(field, (payload as any)[field], rule, issues);
    if (sanitizedValue !== undefined) {
      sanitized[field] = sanitizedValue as any;
    }
  }

  for (const field of NUMERIC_FIELDS) {
    const rule = NUMBER_RULES[field];
    const sanitizedValue = sanitizeNumberField(field, (payload as any)[field], rule, issues);
    if (sanitizedValue !== undefined) {
      sanitized[field] = sanitizedValue as any;
    }
  }

  const sanitizedStatus = sanitizeStatus((payload as any).status, issues);
  if (sanitizedStatus !== undefined) {
    sanitized.status = sanitizedStatus;
  }

  if (issues.length > 0) {
    throw buildValidationError(issues);
  }

  return sanitized as AddLaptopDTO;
};

export async function addLaptop(payload: AddLaptopDTO): Promise<AddLaptopResponse> {
  const sanitizedPayload = sanitizeAddLaptopPayload(payload);

  try {
    const { data } = await client.post<AddLaptopResponse>(
      '/api/laptops/create',
      sanitizedPayload,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return data;
  } catch (error) {
    if (isAxiosErrorInstance(error)) {
      throwEnhancedLaptopAxiosError(error);
    }
    throw error;
  }
}
