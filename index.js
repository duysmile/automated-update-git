const express = require('express');

const uploadGit = require('./upload-git');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('ok');
});

app.get('/git', async (req, res) => {
    try {
         await uploadGit();
         return res.send('success');
    } catch (error) {
        console.error(error);
        res.status(500).send('failed');
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server start at port ${port}`);
});
