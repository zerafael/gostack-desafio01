const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
var contReq = 0;

/* Middlewares */

server.use((req, res, next) => {
	contReq += 1;

	console.log(`${contReq} requisições feitas até o momento.`);

	return next();
});

function checkProjectExists(req, res, next) {
	const { id } = req.params;

	const project = projects.find(p => p.id == id);

	if (!project) {
		return res.status(400).json({ error: "Project does not exist" });
	}

	next();
}

/* Routes */

// Create project
server.post("/projects", (req, res) => {
	const { id } = req.body;
	const { title } = req.body;

	const project = {
		id: id,
		title: title,
		task: []
	};

	projects.push(project);

	return res.json(project);
});

// List all projects
server.get("/projects", (req, res) => {
	return res.json(projects);
});

// Edit project title
server.put("/projects/:id", checkProjectExists, (req, res) => {
	const { id } = req.params;
	const { title } = req.body;

	const project = projects.find(p => p.id == id);

	project.title = title;

	return res.json(project);
});

// Delete project
server.delete("/projects/:id", checkProjectExists, (req, res) => {
	const { id } = req.params;

	const index = projects.findIndex(p => p.id == id);

	projects.splice(index, 1);

	return res.json(projects);
});

// Add tasks to project
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
	const { id } = req.params;
	const { title } = req.body;

	const project = projects.find(p => p.id == id);

	project.task.push(title);

	return res.json(project);
});

server.listen(3000);
