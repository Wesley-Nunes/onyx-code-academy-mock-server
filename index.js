import express from 'express';
import multer from 'multer';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const upload = multer({ dest: 'uploads/' });
const port = process.env.PORT || 4000;

// Mock data
let videos = [];
let lessons = [];
let quizzes = [];
const mockVideoUrl = 'http://download.blender.org/peach/trailer/trailer_480p.mov';

app.use(cors());
app.use(express.json());

app.post('/api/v1/courses/:courseId/lessons',
	upload.single('video'),
	(req, res) => {
		const { name } = req.body;
		const video = req.file;

		const videoId = `vid${videos.length + 1}`;
		const lessonId = `les${lessons.length + 1}`;
		const lesson = {
			id: lessonId,
			name,
			videoId,
			courseId: req.params.courseId
		};

		videos.push(video.originalname);
		lessons.push(lesson);

		res.status(201).json(lesson);
	}
);

app.get('/api/v1/courses/:courseId/lessons', (req, res) => {
	res.json(lessons.filter(l => l.courseId === req.params.courseId));
});

app.get('/api/v1/courses/:courseId/lessons/:lessonId', (req, res) => {
	const lesson = lessons.find(l => l.id == req.params.lessonId && l.courseId === req.params.courseId);
	if (lesson) {
		res.json(lesson);
	} else {
		res.status(404).send('Lesson not found');
	}
});

app.patch('/api/v1/courses/:courseId/lessons/:lessonId', (req, res) => {
	const { name } = req.body;
	const lesson = lessons.find(l => l.id == req.params.lessonId && l.courseId === req.params.courseId);
	if (lesson) {
		lesson.name = name;
		res.json(lesson);
	} else {
		res.status(404).send('Lesson not found');
	}
});

app.delete('/api/v1/courses/:courseId/lessons/:lessonId', (req, res) => {
	lessons = lessons.filter(l => !(l.id == req.params.lessonId && l.courseId === req.params.courseId));
	quizzes = quizzes.filter(q => q.lessonId != req.params.lessonId);
	res.status(204).send();
});

app.get('/api/v1/videos/:videoId/stream', (req, res) => {
	res.setHeader('Content-Type', 'video/mp4');
	res.setHeader('Content-Range', 'bytes 0-2000/2000');
	res.setHeader('Content-Length', '2000');
	res.redirect(mockVideoUrl);
});

app.get('/api/v1/videos/:videoId/stream/:partialVideoId', (req, res) => {
	res.setHeader('Content-Type', 'video/mp4');
	res.setHeader('Content-Range', 'bytes 1001-2000/2000');
	res.setHeader('Content-Length', '1000');
	res.redirect(mockVideoUrl);
});

app.post('/api/v1/lessons/:lessonId/quizzes', (req, res) => {
	const { timestamp } = req.body;
	const quizId = `qui${quizzes.length + 1}`;
	const quiz = {
		id: quizId,
		timestamp,
		lessonId: req.params.lessonId,
		quiz: {
			question: "Do you want to proceed?",
			options: [
				{ id: "opt1", text: "Yes" },
				{ id: "opt2", text: "No" }
			]
		}
	};
	quizzes.push(quiz);
	res.status(201).json(quiz);
});

app.get('/api/v1/lessons/:lessonId/quizzes', (req, res) => {
	res.json(quizzes.filter(q => q.lessonId == req.params.lessonId));
});

app.get('/api/v1/lessons/:lessonId/quizzes/:quizId', (req, res) => {
	const quiz = quizzes.find(q => q.id == req.params.quizId && q.lessonId === req.params.lessonId);
	if (quiz) {
		res.json(quiz);
	} else {
		res.status(404).send('Quiz not found');
	}
});

app.patch('/api/v1/lessons/:lessonId/quizzes/:quizId', (req, res) => {
	const { timestamp } = req.body;
	const quiz = quizzes.find(q => q.id == req.params.quizId && q.lessonId == req.params.lessonId);
	if (quiz) {
		quiz.timestamp = timestamp;
		res.json(quiz);
	} else {
		res.status(404).send('Quiz not found');
	}
});

app.delete('/api/v1/lessons/:lessonId/quizzes/:quizId', (req, res) => {
	quizzes = quizzes.filter(q => !(q.id == req.params.quizId && q.lessonId == req.params.lessonId));
	res.status(204).send();
});

app.post('/api/v1/quizzes/:quizId/submit', (req, res) => {
	const { answerId } = req.body;

	if (answerId === 'opt1') {
		const partialVideoId = 'par1';
		res.status(200).json({ partialVideoId });
	} else {
		res.status(400).json({ error: 'wrong answer' });
	}
});

app.listen(port, () => {
	console.log(`Mock server listening at http://localhost:${port}`);
});

