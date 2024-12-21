import { Request } from 'express';
import { User } from './entities/User';
import { WorkEntry } from './entities/WorkEntry';

export interface AuthRequest extends Request {
    user?: {
        userId: number;
    };
}

export interface WeeklyReport {
    totalHours: number;
    overtimeHours: number;
    entries: WorkEntry[];
}

// Réexporter les entités si nécessaire
export { User, WorkEntry };