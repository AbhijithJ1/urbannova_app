export type IssueLabel = "WASTE" | "WATER" | "ENERGY" | "POLLUTION";
export type IssueStatus = "OPEN" | "INPROGRESS" | "COMPLETED" | "BLOCKED";
export type Role = "ADMIN" | "USER";

export interface Ward {
  id: string;
  name: string;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  wardId?: string | null;
  createdAt: Date;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  landmark: string;
  label: IssueLabel;
  score: number;
  status: IssueStatus;
  blockReason?: string | null;
  wardId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  ward?: Ward;
  user?: Pick<User, "id" | "name" | "email">;
}

export interface IssueStatusLog {
  id: string;
  issueId: string;
  status: IssueStatus;
  blockReason?: string | null;
  changedById: string;
  changedBy?: Pick<User, "id" | "name">;
  changedAt: Date;
}
