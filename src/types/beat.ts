export interface Beat {
  id: string;
  title: string;
  creatorAddress: string;
  creatorName?: string;
  audioUrl: string;
  kitUsed: string;
  duration: number;
  plays: number;
  createdAt: string;
}

export interface CreateBeatRequest {
  title: string;
  creatorAddress: string;
  creatorName?: string;
  audioBlob: Blob;
  kitUsed: string;
  duration: number;
}
