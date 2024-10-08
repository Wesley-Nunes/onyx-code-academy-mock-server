import express from 'express';
import multer from 'multer';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
	console.log(`Mock server listening at http://localhost:${port}`);
});

