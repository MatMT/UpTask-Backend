import {Router} from "express";
import {body, param} from "express-validator";
import {ProjectController} from "../controllers/ProjectController";
import {handleInputErrors} from "../middleware/validation";
import {TaskController} from "../controllers/TaskController";
import {validateProjectExists} from "../middleware/project";
import {authenticate} from "../middleware/auht";

const router = Router();

router.post('/',
    authenticate,
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

// Middleware to validate if project exists when route has projectId param
router.param('projectId', validateProjectExists);

router.post('/:projectId/tasks',
    body('name')
        .trim().notEmpty().withMessage('Task\'s name is required'),
    body('description')
        .trim().notEmpty().withMessage('Task\'s description is required'),
    handleInputErrors,
    TaskController.createTask
);

router.get('/:projectId/tasks',
    TaskController.getProjectTasks
);

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    handleInputErrors,
    TaskController.getTaskById
);

router.put('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    body('name')
        .trim().notEmpty().withMessage('Task\'s name is required'),
    body('description')
        .trim().notEmpty().withMessage('Task\'s description is required'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    handleInputErrors,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    body('status').notEmpty().withMessage('Task\'s status is required'),
    handleInputErrors,
    TaskController.updateStatus
)

export default router;