import express from "express";
import os from "os";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  const helloMessage = `<h1>[k8s-web-hello v1.0]: Hello from ${os.hostname()}</h1>`;
  console.log(helloMessage);
  res.send(helloMessage);
});

app.listen(PORT, () => {
  console.log(`Web server is listening at port ${PORT}`);
});
