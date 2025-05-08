export function normalizeKeys(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => normalizeKeys(item));
    }
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }
  
    const normalized: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(obj)) {
      const normalizedKey = key.charAt(0).toLowerCase() + key.slice(1);
      normalized[normalizedKey] = normalizeKeys(value);
    }
    return normalized;
  }