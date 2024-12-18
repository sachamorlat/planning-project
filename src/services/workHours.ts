import { WorkEntry, WeeklyReport } from '../types';

export class WorkHoursService {
    private static workEntries: WorkEntry[] = [];
    private static workEntryId = 1;

    static calculateWorkingHours(entry: WorkEntry): number {
        const start = new Date(`${entry.date}T${entry.startTime}`);
        const end = new Date(`${entry.date}T${entry.endTime}`);
        const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return diffHours - (entry.breakDuration / 60);
    }

    static calculateWeeklyHours(entries: WorkEntry[]): WeeklyReport {
        const totalHours = entries.reduce((sum, entry) => {
            return sum + this.calculateWorkingHours(entry);
        }, 0);

        const overtimeHours = Math.max(0, totalHours - 35);

        return {
            totalHours,
            overtimeHours,
            entries
        };
    }

    static getAllEntries(userId: number): WorkEntry[] {
        return this.workEntries.filter(entry => entry.userId === userId);
    }

    static addEntry(entry: Omit<WorkEntry, 'id' | 'created_at'>): WorkEntry {
        const newEntry: WorkEntry = {
            ...entry,
            id: this.workEntryId++,
            created_at: new Date().toISOString()
        };
        this.workEntries.push(newEntry);
        return newEntry;
    }

    static getWeeklyEntries(userId: number, date: string) {
        const requestDate = new Date(date);
        const startOfWeek = new Date(requestDate);
        startOfWeek.setDate(requestDate.getDate() - requestDate.getDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return this.workEntries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entry.userId === userId &&
                entryDate >= startOfWeek &&
                entryDate <= endOfWeek;
        });
    }

    static getMonthlyEntries(userId: number, year: number, month: number) {
        return this.workEntries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entry.userId === userId &&
                entryDate.getFullYear() === year &&
                entryDate.getMonth() === month - 1;
        });
    }

    static updateEntry(id: number, userId: number, updates: Partial<WorkEntry>): WorkEntry | null {
        const entryIndex = this.workEntries.findIndex(e => e.id === id && e.userId === userId);

        if (entryIndex === -1) return null;

        const updatedEntry = {
            ...this.workEntries[entryIndex],
            ...updates,
            id,
            userId
        };

        this.workEntries[entryIndex] = updatedEntry;
        return updatedEntry;
    }

    static deleteEntry(id: number, userId: number): boolean {
        const initialLength = this.workEntries.length;
        this.workEntries = this.workEntries.filter(e => !(e.id === id && e.userId === userId));
        return this.workEntries.length !== initialLength;
    }
}