import { Request } from 'express';

export interface AuthRequest extends Request {
    user?: {
        userId: number;
    };
}

export interface User {
    id: number;
    email: string;
    name: string;
    password: string;
}

export interface WorkEntry {
    id: number;
    userId: number;
    date: string;
    location: string;
    teammate: string;
    startTime: string;
    endTime: string;
    breakDuration: number;
    created_at: string;
}

export interface WeeklyReport {
    totalHours: number;
    overtimeHours: number;
    entries: WorkEntry[];
}