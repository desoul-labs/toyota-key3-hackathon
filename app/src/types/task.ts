export interface Item {
  id: string;
  title: string;
  description: string;
  expiredAt: string;
  user?: string;
  status: 0 | 1 | 2; // 0: not started, 1: in progress, 2: completed
};
