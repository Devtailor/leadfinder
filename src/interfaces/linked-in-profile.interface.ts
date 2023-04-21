export interface LinkedInProfile {
  readonly linkedinUrl: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly headline: string;
  readonly location: unknown;
  readonly address: unknown;
  readonly industry?: string;
  readonly summary?: string;
}
