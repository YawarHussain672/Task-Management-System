import { Router } from 'express';
import {
    getTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask,
    toggleTask,
} from '../controllers/task.controller';
import { authMiddleware } from '../middleware/auth';
import {
    createTaskValidation,
    updateTaskValidation,
    taskIdValidation,
    getTasksValidation,
    validate,
} from '../middleware/validation';

const router = Router();

// All task routes require authentication
router.use(authMiddleware);

// GET /tasks - List tasks with pagination, filtering, search
router.get('/', getTasksValidation, validate, getTasks);

// POST /tasks - Create a new task
router.post('/', createTaskValidation, validate, createTask);

// GET /tasks/:id - Get a single task
router.get('/:id', taskIdValidation, validate, getTask);

// PATCH /tasks/:id - Update a task
router.patch('/:id', updateTaskValidation, validate, updateTask);

// DELETE /tasks/:id - Delete a task
router.delete('/:id', taskIdValidation, validate, deleteTask);

// POST /tasks/:id/toggle - Toggle task status
router.post('/:id/toggle', taskIdValidation, validate, toggleTask);

export default router;
