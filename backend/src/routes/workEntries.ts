import express, { Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { checkAuth } from '../middleware/checkAuth';
import { AuthRequest } from '../types';
import { WorkHoursService } from '../services/workHours';

const router = express.Router();

// Endpoints for work entries
router.get('/work-entries', authenticateToken, checkAuth, (req: AuthRequest, res: Response) => {
    const entries = WorkHoursService.getAllEntries(req.user!.userId);
    res.json(entries);
});

router.post('/work-entries', authenticateToken, checkAuth, (req: AuthRequest, res: Response) => {
    const { date, location, teammate, startTime, endTime, breakDuration } = req.body;
    const entry = WorkHoursService.addEntry({
        userId: req.user!.userId,
        date,
        location,
        teammate,
        startTime,
        endTime,
        breakDuration
    });
    res.status(201).json(entry);
});

router.get('/work-entries/weekly/:date', authenticateToken, checkAuth, (req: AuthRequest, res: Response) => {
    const entries = WorkHoursService.getWeeklyEntries(req.user!.userId, req.params.date);
    const report = WorkHoursService.calculateWeeklyHours(entries);
    res.json(report);
});

router.get('/work-entries/monthly/:year/:month', authenticateToken, checkAuth, (req: AuthRequest, res: Response) => {
    const { year, month } = req.params;
    const entries = WorkHoursService.getMonthlyEntries(
        req.user!.userId,
        parseInt(year),
        parseInt(month)
    );
    res.json(entries);
});

router.put('/work-entries/:id', authenticateToken, checkAuth, (req: AuthRequest, res: Response) => {
    const entryId = parseInt(req.params.id);
    const updatedEntry = WorkHoursService.updateEntry(entryId, req.user!.userId, req.body);

    if (!updatedEntry) {
        return res.status(404).json({ message: 'Entry not found' });
    }

    res.json(updatedEntry);
});

router.delete('/work-entries/:id', authenticateToken, checkAuth, (req: AuthRequest, res: Response) => {
    const entryId = parseInt(req.params.id);
    const deleted = WorkHoursService.deleteEntry(entryId, req.user!.userId);

    if (!deleted) {
        return res.status(404).json({ message: 'Entry not found' });
    }

    res.status(204).send();
});

export default router;