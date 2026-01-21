import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

// GET /tasks - List tasks with pagination, filtering, and search
export const getTasks = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as TaskStatus | undefined;
        const search = req.query.search as string | undefined;

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = { userId };

        if (status) {
            where.status = status;
        }

        if (search) {
            where.title = { contains: search };
        }

        // Get tasks and total count
        const [tasks, total] = await Promise.all([
            prisma.task.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.task.count({ where }),
        ]);

        res.json({
            tasks,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

// POST /tasks - Create a new task
export const createTask = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const { title, description, status } = req.body;

        const task = await prisma.task.create({
            data: {
                title,
                description,
                status: status || 'PENDING',
                userId,
            },
        });

        res.status(201).json({
            message: 'Task created successfully',
            task,
        });
    } catch (error) {
        next(error);
    }
};

// GET /tasks/:id - Get a single task
export const getTask = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;

        const task = await prisma.task.findFirst({
            where: { id, userId },
        });

        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        res.json({ task });
    } catch (error) {
        next(error);
    }
};

// PATCH /tasks/:id - Update a task
export const updateTask = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;
        const { title, description, status } = req.body;

        // Check if task exists and belongs to user
        const existingTask = await prisma.task.findFirst({
            where: { id, userId },
        });

        if (!existingTask) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        const task = await prisma.task.update({
            where: { id },
            data: {
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(status !== undefined && { status }),
            },
        });

        res.json({
            message: 'Task updated successfully',
            task,
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /tasks/:id - Delete a task
export const deleteTask = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;

        // Check if task exists and belongs to user
        const existingTask = await prisma.task.findFirst({
            where: { id, userId },
        });

        if (!existingTask) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        await prisma.task.delete({ where: { id } });

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// POST /tasks/:id/toggle - Toggle task status
export const toggleTask = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;

        // Check if task exists and belongs to user
        const existingTask = await prisma.task.findFirst({
            where: { id, userId },
        });

        if (!existingTask) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        // Toggle status: PENDING -> IN_PROGRESS -> COMPLETED -> PENDING
        const statusMap: Record<TaskStatus, TaskStatus> = {
            PENDING: 'IN_PROGRESS',
            IN_PROGRESS: 'COMPLETED',
            COMPLETED: 'PENDING',
        };

        const newStatus = statusMap[existingTask.status as TaskStatus];

        const task = await prisma.task.update({
            where: { id },
            data: { status: newStatus },
        });

        res.json({
            message: 'Task status toggled successfully',
            task,
        });
    } catch (error) {
        next(error);
    }
};
