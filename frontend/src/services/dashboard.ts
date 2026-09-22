export interface DashboardStats {
  totalClients: number;
  totalPaid: number;
  totalCredit: number;
}

export interface ActivityItem {
  id: number;
  client_id?: number;
  client_name: string;
  type: 'paiement' | 'credit' | 'nouveau_client';
  amount: number;
  description?: string;
  created_at: string;
}

export interface ClientItem {
  id: number;
  name: string;
  phone?: string;
  credit: number;
  total_paid?: number;
  status?: string;
  created_at: string;
}

export interface DashboardData {
  success: boolean;
  isDemo?: boolean;
  stats: DashboardStats;
  recentActivities: ActivityItem[];
  recentClients: ClientItem[];
}

export const FALLBACK_CLIENTS: ClientItem[] = [
  {
    id: 1,
    name: 'Mohamed Amrani',
    phone: '06 61 23 45 67',
    credit: 4500,
    total_paid: 18000,
    status: 'actif',
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: 2,
    name: 'Amina Benali',
    phone: '07 72 34 56 78',
    credit: 0,
    total_paid: 12500,
    status: 'actif',
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
  {
    id: 3,
    name: 'Karim Zeroual',
    phone: '05 50 12 34 56',
    credit: 8200,
    total_paid: 24000,
    status: 'actif',
    created_at: new Date(Date.now() - 72 * 3600000).toISOString(),
  },
  {
    id: 4,
    name: 'Fatima Zohra',
    phone: '06 63 98 76 54',
    credit: 1500,
    total_paid: 9500,
    status: 'actif',
    created_at: new Date(Date.now() - 96 * 3600000).toISOString(),
  },
  {
    id: 5,
    name: 'Yassine Mansouri',
    phone: '07 70 88 99 00',
    credit: 3200,
    total_paid: 15300,
    status: 'actif',
    created_at: new Date(Date.now() - 120 * 3600000).toISOString(),
  },
];

export const FALLBACK_ACTIVITIES: ActivityItem[] = [
  {
    id: 1,
    client_id: 1,
    client_name: 'Mohamed Amrani',
    type: 'paiement',
    amount: 3000,
    description: 'Règlement partiel en espèces',
    created_at: new Date(Date.now() - 25 * 60000).toISOString(),
  },
  {
    id: 2,
    client_id: 3,
    client_name: 'Karim Zeroual',
    type: 'credit',
    amount: 2500,
    description: 'Achat marchandises à crédit',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 3,
    client_id: 2,
    client_name: 'Amina Benali',
    type: 'paiement',
    amount: 4500,
    description: 'Solde de tout compte',
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: 4,
    client_id: 4,
    client_name: 'Fatima Zohra',
    type: 'credit',
    amount: 1500,
    description: 'Produits d’épicerie',
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: 5,
    client_id: 5,
    client_name: 'Yassine Mansouri',
    type: 'nouveau_client',
    amount: 0,
    description: 'Nouveau client enregistré',
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
];

export const FALLBACK_DASHBOARD_DATA: DashboardData = {
  success: true,
  isDemo: true,
  stats: {
    totalClients: 5,
    totalPaid: 69300,
    totalCredit: 17400,
  },
  recentActivities: FALLBACK_ACTIVITIES,
  recentClients: FALLBACK_CLIENTS,
};

const BASE_URL = 'http://localhost:3000';

export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(`${BASE_URL}/api/dashboard`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.stats) {
        return data;
      }
    }
  } catch (error) {
    // Mode local silencieux
  }

  return FALLBACK_DASHBOARD_DATA;
}

export async function fetchClients(search: string = '', filter: string = 'all'): Promise<ClientItem[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (filter && filter !== 'all') queryParams.append('filter', filter);

    const url = `${BASE_URL}/api/clients${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (e) {
    // Fallback local
  }

  // Filtrage local en cas de fallback
  let clients = [...FALLBACK_CLIENTS];
  if (search) {
    const s = search.toLowerCase();
    clients = clients.filter((c) => c.name.toLowerCase().includes(s) || (c.phone && c.phone.includes(s)));
  }
  if (filter === 'debt') {
    clients = clients.filter((c) => c.credit > 0);
  } else if (filter === 'settled') {
    clients = clients.filter((c) => c.credit === 0);
  }
  return clients;
}

export async function createClient(data: {
  name: string;
  phone?: string;
  credit?: number;
}): Promise<{ success: boolean; client?: ClientItem; message?: string }> {
  try {
    const response = await fetch(`${BASE_URL}/api/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const res = await response.json();
      return res;
    }
  } catch (e) {
    // Fallback local
  }

  // Mock local
  const newClient: ClientItem = {
    id: Date.now(),
    name: data.name,
    phone: data.phone || '',
    credit: Number(data.credit) || 0,
    total_paid: 0,
    status: 'actif',
    created_at: new Date().toISOString(),
  };
  FALLBACK_CLIENTS.unshift(newClient);
  return { success: true, client: newClient };
}

export async function createTransaction(data: {
  client_id?: number;
  client_name: string;
  type: 'paiement' | 'credit';
  amount: number;
  description?: string;
}): Promise<{ success: boolean; activity?: ActivityItem; message?: string }> {
  try {
    const response = await fetch(`${BASE_URL}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const res = await response.json();
      return res;
    }
  } catch (e) {
    // Fallback local
  }

  // Update mock local
  const newActivity: ActivityItem = {
    id: Date.now(),
    client_id: data.client_id,
    client_name: data.client_name,
    type: data.type,
    amount: data.amount,
    description: data.description || (data.type === 'paiement' ? 'Paiement reçu' : 'Crédit accordé'),
    created_at: new Date().toISOString(),
  };
  FALLBACK_ACTIVITIES.unshift(newActivity);

  const client = FALLBACK_CLIENTS.find(
    (c) => (data.client_id && c.id === data.client_id) || c.name.toLowerCase() === data.client_name.toLowerCase()
  );
  if (client) {
    if (data.type === 'paiement') {
      client.credit = Math.max(0, client.credit - data.amount);
      client.total_paid = (client.total_paid || 0) + data.amount;
    } else {
      client.credit += data.amount;
    }
  }

  return { success: true, activity: newActivity };
}

export async function deleteClient(id: number): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${BASE_URL}/api/clients/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      return { success: true };
    }
  } catch (e) {}

  const idx = FALLBACK_CLIENTS.findIndex((c) => c.id === id);
  if (idx !== -1) {
    FALLBACK_CLIENTS.splice(idx, 1);
  }
  return { success: true };
}

export function formatCurrency(amount: number, currency: string = 'DA'): string {
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} ${currency}`;
}

export function formatTimeAgo(dateInput: string): string {
  try {
    const now = new Date();
    const date = new Date(dateInput);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 2) return 'À l’instant';
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} j`;

    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  } catch {
    return 'Récemment';
  }
}
