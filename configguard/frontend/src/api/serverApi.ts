export interface Server {
  _id: string;
  hostname: string;
  ip: string;
  environment: string;
  status: string;
  enrollmentStatus: string;
  createdAt: string;
}

export interface RegisterServerData {
  hostname: string;
  ip: string;
  environment: string;
  profileId?: string;
}

export interface RegisterServerResponse {
  message: string;
  server: { id: string; hostname: string };
  enrollmentToken: string;
  expiresAt: string;
}

export const getServers = async (): Promise<Server[]> => {
  const response = await fetch('/api/servers');
  if (!response.ok) {
    throw new Error('Failed to fetch servers');
  }
  const data = await response.json();
  return data.servers;
};

export const registerServer = async (data: RegisterServerData): Promise<RegisterServerResponse> => {
  const response = await fetch('/api/servers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to register server');
  }
  
  return response.json();
};
