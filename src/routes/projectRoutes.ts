import {Router} from "express";
import {body, param} from "express-validator";
import {ProjectController} from "../controllers/ProjectController";
import {handleInputErrors} from "../middleware/validation";
import {TaskController} from "../controllers/TaskController";
import project from "../models/Project";
import {validateProjectExists} from "../middleware/project";

const router = Router();

router.post('/',
    body('projectName')
        .trim().notEmpty().withMessage('Project\'s name is required'),
    body('clientName')
        .trim().notEmpty().withMessage('Client\'s name is required'),
    body('description')
        .trim().notEmpty().withMessage('Project\'s description is required'),
    handleInputErrors,
    ProjectController.createProject
);

router.get('/', ProjectController.getAllProjects)
router.get('/:id',
    param('id').isMongoId().withMessage('Invalid project ID'),
    handleInputErrors,
    ProjectController.getProjectById
);

router.put('/:id',
    param('id').isMongoId().withMessage('Invalid project ID'),
    body('projectName')
        .trim().notEmpty().withMessage('Project\'s name is required'),
    body('clientName')
        .trim().notEmpty().withMessage('Client\'s name is required'),
    body('description')
        .trim().notEmpty().withMessage('Project\'s description is required'),
    handleInputErrors,
    ProjectController.updateProject
)

router.delete('/:id',
    param('id').isMongoId().withMessage('Invalid project ID'),
    handleInputErrors,
    ProjectController.deleteProject
)

/**
 * Task's routes ===============================================================
 */

router.post('/:projectId/tasks',
    validateProjectExists,
    body('name')
        .trim().notEmpty().withMessage('Task\'s name is required'),
    body('description')
        .trim().notEmpty().withMessage('Task\'s description is required'),
    handleInputErrors,
    TaskController.createTask
);

router.get('/:projectId/tasks',
    validateProjectExists,
    TaskController.getProjectTasks
);

export default router;