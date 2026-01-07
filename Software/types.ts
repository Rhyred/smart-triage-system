/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
export type AspectRatio = '16:9' | '9:16' | '1:1';

export type ComplexityLevel = 'Elementary' | 'High School' | 'College' | 'Expert';

export type VisualStyle = 'Default' | 'Minimalist' | 'Realistic' | 'Cartoon' | 'Vintage' | 'Futuristic' | '3D Render' | 'Sketch';

export type Language = 'English' | 'Spanish' | 'French' | 'German' | 'Mandarin' | 'Japanese' | 'Hindi' | 'Arabic' | 'Portuguese' | 'Russian';

// Tipe data untuk triase kesehatan umum
export type TriageStatus = 'NORMAL' | 'WASPADA' | 'KRITIS' | 'DARURAT';

export type HealthParameter = 'temperature' | 'spo2' | 'heart_rate' | 'blood_pressure' | 'respiratory_rate';

export interface HealthData {
  temperature: number; // Celsius
  spo2: number; // Percentage
  heartRate?: number; // BPM
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  respiratoryRate?: number; // breaths per minute
  symptoms?: string[]; // Array of detected symptoms
  status: TriageStatus;
  message: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendations?: string[];
}

export interface AIAnalysisResult {
  healthData: HealthData;
  confidence: number; // 0-1
  detectedConditions?: string[];
  timestamp: number;
}

export interface GeneratedImage {
  id: string;
  data: string; // Base64 data URL
  prompt: string;
  timestamp: number;
  level?: ComplexityLevel;
  style?: VisualStyle;
  language?: Language;
}

export interface SearchResultItem {
  title: string;
  url: string;
}

export interface ResearchResult {
  imagePrompt: string;
  facts: string[];
  searchResults: SearchResultItem[];
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}