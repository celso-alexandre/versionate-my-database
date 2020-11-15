import git from 'nodegit';
import express from 'express';
import path from 'path';
import fs from 'fs';

const server = express();

server.use(express.json());

server.post('/git/repository/create', async (request, response) => {
  const { repositoryName } = request.body;
  const pathToRepo = path.resolve(`./tmp/repository/${repositoryName}`);

  if (!fs.existsSync(pathToRepo)) {
    fs.mkdirSync(pathToRepo);
    await git.Repository.init(pathToRepo, 0);
  }

  const repo = await git.Repository.open(pathToRepo);
  let remotes = await git.Remote.list(repo) as string[];
  remotes = remotes.filter((remote_) => (
    remote_ === 'origin'
  ));

  if (remotes && remotes.length > 0) {
    await git.Remote.delete(repo, 'origin');
  }

  git.Remote.create(repo, 'origin', 'https://github.com/celso-alexandre/gitgubapi-test.git');
  git.Remote.addPush(repo, 'origin', 'master');
  git.Remote.addFetch(repo, 'origin', 'master');
  const fetch = new git.Fetch();

  return response.json({ ok: true });
});

server.listen(3333, () => {
  console.log('Escutando na porta 3333');
});
