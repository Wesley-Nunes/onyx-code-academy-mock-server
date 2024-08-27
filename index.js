import express from 'express';
import multer from 'multer';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
	console.log(`Mock server listening at http://localhost:${port}`);
});

