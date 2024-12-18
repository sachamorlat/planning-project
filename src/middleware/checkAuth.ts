import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

export const checkAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthenticated user' });
    }
    next();
};