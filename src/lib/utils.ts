/**
 * Generate a URL-safe slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Validate that content doesn't contain harmful synthesis information, dosages, or harmful guidance
 */
export function validateSafeContent(content: string): boolean {
  const dangerousKeywords = [
    // Synthesis keywords
    'synthesize',
    'synthesis procedure',
    'lab synthesis',
    'chemical synthesis',
    'prepare in lab',
    'laboratory preparation',
    'step-by-step synthesis',
    'molecular synthesis',
    'how to make',
    'how to prepare',
    'manufacturing process',
    'production method',
    // Dosage keywords (specific amounts)
    'take x mg',
    'dose of',
    'dosage of',
    'mg per day',
    'mg/kg',
    'specific dosage',
    'exact dose',
    'recommended dose',
    // Harmful guidance
    'safe to abuse',
    'recreational use',
    'how to get high',
    'street value',
    'illegal use',
  ];

  const lowerContent = content.toLowerCase();
  
  // Check for dangerous keywords
  if (dangerousKeywords.some((keyword) => lowerContent.includes(keyword))) {
    return false;
  }

  // Check for specific dosage patterns (e.g., "take 500mg", "dose: 10mg")
  const dosagePattern = /\b\d+\s*(mg|g|ml|milligram|gram|milliliter)\b/gi;
  if (dosagePattern.test(content)) {
    // Allow general statements like "consult healthcare professional for dosage"
    // but block specific dosage recommendations
    const allowedContexts = [
      'consult',
      'healthcare',
      'professional',
      'doctor',
      'physician',
      'prescribed',
      'general',
      'information',
    ];
    const hasAllowedContext = allowedContexts.some((context) =>
      lowerContent.includes(context)
    );
    if (!hasAllowedContext) {
      return false;
    }
  }

  return true;
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
