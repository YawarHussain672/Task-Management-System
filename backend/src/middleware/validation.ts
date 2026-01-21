import { Response, NextFunction } from 'express';
import { validationResult, body, param, query } from 'express-validator';
import { AuthRequest } from './auth';

export const validate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};

// Auth validation rules
export const registerValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];

export const loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
];

export const refreshValidation = [
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];

// Task validation rules
export const createTaskValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 255 })
        .withMessage('Title must be less than 255 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    body('status')
        .optional()
        .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
        .withMessage('Invalid status value'),
];

export const updateTaskValidation = [
    param('id').isUUID().withMessage('Invalid task ID'),
    body('title')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Title cannot be empty')
        .isLength({ max: 255 })
        .withMessage('Title must be less than 255 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    body('status')
        .optional()
        .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
        .withMessage('Invalid status value'),
];

export const taskIdValidation = [
    param('id').isUUID().withMessage('Invalid task ID'),
];

export const getTasksValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    query('status')
        .optional()
        .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
        .withMessage('Invalid status filter'),
    query('search')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Search query too long'),
];
