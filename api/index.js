import express from 'express'

const app = express();

app.listen(3000, () => {
    console.log("Server up and listening on port 3000!")
});