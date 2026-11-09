export interface AchieverItem {
  id: string;
  name: string;
  classGrade: number; // 6, 7, 8, 9, 10
  classLabel: string;
  achievement: string;
  institution: string;
  photoUrl: string;
  badge?: string;
  year?: string;
}

export const DEFAULT_ACHIEVERS: AchieverItem[] = [];
