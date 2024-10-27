import {Router} from "express";
import {body, param} from "express-validator";
import {ProjectController} from "../controllers/ProjectController";
import {handleInputErrors} from "../middleware/validation";

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
    ProjectController.getProjectById);

export default router;