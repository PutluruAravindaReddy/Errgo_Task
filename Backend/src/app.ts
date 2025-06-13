import express from 'express';
import cors from 'cors';
import { IProject, ProjectInputSchema } from './models/project.interface';
import { v4 as uuid } from 'uuid';

// --- WebSocket chat setup ---
import http from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const PORT = 3000;
const server = http.createServer(app);

// List of projects
const projects: IProject[] = [];

// Chat state
type ChatMessage = { text: string; timestamp: number; };
const chatMessages: ChatMessage[] = [];

// Setup cors and express.json()
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

app.get('/', (_req, res) => {
  /**
   * TODO: Complete the method for creating a new project
   * The response should contain an object of type IProject
   * 
   * Hint: Utilize the `projects` to store the newly generated of project
   * Hint: Utilize the `uuid` npm package to generate the unique ids for the project
   */

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
  const result = ProjectInputSchema.safeParse(project);
  if (!result.success) {
    return res.status(400).json({
      error: "Invalid project data. Must include name and description.",
      details: result.error.errors.map(e => e.message)
    });
  }
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

// --- BONUS: WebSocket Chat Server ---
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  // Send chat history on new connection
  ws.send(JSON.stringify({ type: "history", messages: chatMessages }));

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.type === "message" && typeof msg.text === "string") {
        const chatMsg = {
          text: msg.text,
          timestamp: Date.now()
        };
        chatMessages.push(chatMsg);
        // Broadcast new message to all clients
        wss.clients.forEach(client => {
          if (client.readyState === ws.OPEN) {
            client.send(JSON.stringify({ type: "message", message: chatMsg }));
          }
        });
      }
    } catch (e) {
      ws.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
    }
  });
});

// Start the HTTP server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`WebSocket chat running at ws://localhost:${PORT}`);
});
