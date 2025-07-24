export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export const saveSupabaseConfig = (config: SupabaseConfig) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('supabaseConfig', JSON.stringify(config));
  }
};

export const getSupabaseConfig = (): SupabaseConfig | null => {
  if (typeof window !== 'undefined') {
    const config = localStorage.getItem('supabaseConfig');
    return config ? JSON.parse(config) : null;
  }
  return null;
};
