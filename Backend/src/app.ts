import express from 'express';
import cors from 'cors';
import { IProject, ProjectInputSchema } from './models/project.interface';
import { v4 as uuid } from 'uuid';

const app = express();
const PORT = 3000;
// List of projects
const projects: IProject[] = [];

// Setup cors and express.json()
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Errgo Backend Interview Module Loaded Successfully!');
});

app.post('/projects', (req, res) => {
  /**
   * TODO: Complete the method for creating a new project
   * The response should contain an object of type IProject
   * 
   * Hint: Utilize the `projects` to store the newly generated of project
   * Hint: Utilize the `uuid` npm package to generate the unique ids for the project
   */

  const { project } = req.body;

  // BONUS: Using zod for validation
  const result = ProjectInputSchema.safeParse(project);
  if (!result.success) {
    // Collect all validation errors for industry-standard feedback
    return res.status(400).json({
      error: "Invalid project data. Must include name and description.",
      details: result.error.errors.map(e => e.message)
    });
  }

  // Creating new project
  const newProject: IProject = {
    id: uuid(),
    name: result.data.name,
    description: result.data.description,
  };
  projects.push(newProject);
  res.status(200).json(newProject);
});

app.get('/projects', (req, res) => {
  /**
   * TODO: Complete the method for returning the current list of projects
   * The responese should contain a list of IProject
   * 
   * Hint: Utilize the `projects` to retrieve the list of projects
   */
  res.status(200).json(projects);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
