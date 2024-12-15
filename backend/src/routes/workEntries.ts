import express, { Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest, WorkEntry, WeeklyReport } from '../types';

const router = express.Router();

// Temporary storage (to be replaced with a database)
let workEntries: WorkEntry[] = [];
let workEntryId = 1;

// Endpoints for work entries
router.post('/', authenticateToken, (req: AuthRequest, res: Response) => {
    const { date, location, teammate, startTime, endTime, breakDuration } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthenticated user' });
    }

    const newEntry: WorkEntry = {
        id: workEntryId++,
        userId,
        date,
        location,
        teammate,
        startTime,
        endTime,
        breakDuration,
        created_at: new Date().toISOString()
    };

    workEntries.push(newEntry);
    res.status(201).json(newEntry);
});

// Get entries for a specific week
router.get('/weekly/:date', authenticateToken, (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthenticated user' });
    }

    const requestDate = new Date(req.params.date);
    const startOfWeek = new Date(requestDate);
    startOfWeek.setDate(requestDate.getDate() - requestDate.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const weekEntries = workEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entry.userId === userId &&
            entryDate >= startOfWeek &&
            entryDate <= endOfWeek;
    });

    // Calculate total and overtime hours
    const report = calculateWeeklyHours(weekEntries);
    res.json(report);
});

// Utility function to calculate hours
function calculateWorkingHours(entry: WorkEntry): number {
    const start = new Date(`${entry.date}T${entry.startTime}`);
    const end = new Date(`${entry.date}T${entry.endTime}`);
    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return diffHours - (entry.breakDuration / 60);
}

function calculateWeeklyHours(entries: WorkEntry[]): WeeklyReport {
    const totalHours = entries.reduce((sum, entry) => {
        return sum + calculateWorkingHours(entry);
    }, 0);

    // Considérer les heures sup au-delà de 35h
    const overtimeHours = Math.max(0, totalHours - 35);

    return {
        totalHours,
        overtimeHours,
        entries
    };
}

// Get entries for a specific month
router.get('/monthly/:year/:month', authenticateToken, (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthenticated user' });
    }

    const { year, month } = req.params;

    const monthEntries = workEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entry.userId === userId &&
            entryDate.getFullYear() === parseInt(year) &&
            entryDate.getMonth() === parseInt(month) - 1;
    });

    res.json(monthEntries);
});

// Edit an entry
router.put('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthenticated user' });
    }

    const entryId = parseInt(req.params.id);

    const entryIndex = workEntries.findIndex(e => e.id === entryId && e.userId === userId);

    if (entryIndex === -1) {
        return res.status(404).json({ message: 'Entry not found' });
    }

    const updatedEntry = {
        ...workEntries[entryIndex],
        ...req.body,
        id: entryId,
        userId
    };

    workEntries[entryIndex] = updatedEntry;
    res.json(updatedEntry);
});

// Delete an entry
router.delete('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthenticated user' });
    }

    const entryId = parseInt(req.params.id);

    const initialLength = workEntries.length;
    workEntries = workEntries.filter(e => !(e.id === entryId && e.userId === userId));

    if (workEntries.length === initialLength) {
        return res.status(404).json({ message: 'Entry not found' });
    }

    res.status(204).send();
});

export default router;