let counter = 0;

export function generateUniqueId(prefix: string = 'id'): string {
  counter += 1;
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${counter}_${randomStr}`;
}
