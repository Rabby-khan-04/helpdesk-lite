export interface Notifier {
  notify(message: string): Promise<void> | void;
}

export const NOTIFIER_TOKEN = {
  log: Symbol('LOG_NOTIFIER'),
  webhook: Symbol('WEBHOOK_NOTIFIER'),
} as const;

export type NotifyChannel = keyof typeof NOTIFIER_TOKEN;
