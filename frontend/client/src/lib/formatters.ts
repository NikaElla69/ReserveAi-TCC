/**
 * Design philosophy for formatting helpers: transform backend precision into human-readable language without visual noise.
 */
export function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long'
  }).format(new Date(date));
}

export function formatTime(time: string) {
  const date = new Date(time);

  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function formatDateTime(date: string, time: string) {
  return `${formatDate(date)} às ${formatTime(time)}`;
}

export function formatRole(role: string) {
  const labels: Record<string, string> = {
    customer: 'Cliente',
    owner: 'Proprietário',
    admin: 'Administrador'
  };

  return labels[role] || role;
}

export function formatReservationStatus(status: string) {
  const labels: Record<string, string> = {
    pending: 'Pendente',
    confirmed: 'Confirmada',
    rejected: 'Rejeitada',
    cancelled: 'Cancelada',
    completed: 'Concluída'
  };

  return labels[status] || status;
}
