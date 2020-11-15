import git from 'nodegit';
import express from 'express';
import path from 'path';
import fs from 'fs';

const server = express();

server.use(express.json());

server.post('/git/repository/create', async (request, response) => {
  const { repositoryName } = request.body;
  const pathToRepo = path.resolve(`./tmp/repository/test/${repositoryName}`);

  if (!fs.existsSync(pathToRepo)) {
    fs.mkdirSync(pathToRepo);
    await git.Repository.init(pathToRepo, 1);
  }

  await git.Repository.open(pathToRepo);

  return response.json({ ok: true });
});

server.listen(3333, () => {
  console.log('Escutando na porta 3333');
});
