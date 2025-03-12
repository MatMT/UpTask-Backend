import {Router} from "express";
import {body, param} from "express-validator";
import {ProjectController} from "../controllers/ProjectController";
import {handleInputErrors} from "../middleware/validation";
import {TaskController} from "../controllers/TaskController";
import {projectExists} from "../middleware/project";
import {taskExists} from "../middleware/taks";
import {authenticate} from "../middleware/auht";
import {TeamController} from "../controllers/TeamController";
import {hasAuthorization} from "../middleware/taks";
import {NoteController} from "../controllers/NoteController";

const router = Router();

router.use(authenticate);

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

// Middleware to validate if project exists when route has projectId param
router.param('projectId', projectExists);

router.post('/:projectId/tasks',
    hasAuthorization,
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

// Middleware to validate if task exists when route has taskId param
router.param('taskId', taskExists);

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    handleInputErrors,
    TaskController.getTaskById
);

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    body('name')
        .trim().notEmpty().withMessage('Task\'s name is required'),
    body('description')
        .trim().notEmpty().withMessage('Task\'s description is required'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
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

router.post('/:projectId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('Invalid email'),
    handleInputErrors,
    TeamController.findMemberByEmail
)

router.get('/:projectId/team',
    TeamController.getProjectTeam
)
router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('Invalid Id'),
    handleInputErrors,
    TeamController.addMemberById
)

router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage('Invalid Id'),
    handleInputErrors,
    TeamController.removeMemberById
)

/** Routes for Notes */
router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage('Note\'s content is required'),
    handleInputErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('Invalid Note ID'),
    handleInputErrors,
    NoteController.deleteNote
)

export default router;