// Read local deployment settings as data, never as shell code.
import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

export function publicationConfig(values) {
  for (const key of ['GITHUB_USER', 'GH_TOKEN', 'GIT_AUTHOR_NAME', 'GIT_AUTHOR_EMAIL']) {
    if (!values[key]?.trim() || /PREENCHA|SEU_USUARIO|SEU_TOKEN/.test(values[key])) {
      throw new Error(`Preencha ${key} em .env.publish.`);
    }
  }
  const user = values.GITHUB_USER.trim();
  const repo = values.GITHUB_REPO?.trim() || `${user}.github.io`;
  if (!/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(user)) throw new Error('GITHUB_USER inválido.');
  if (!/^[a-z\d_.-]+$/i.test(repo) || ['.', '..'].includes(repo)) throw new Error('GITHUB_REPO inválido.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.GIT_AUTHOR_EMAIL)) throw new Error('GIT_AUTHOR_EMAIL inválido.');
  const origin = `https://${user.toLowerCase()}.github.io`;
  const base = repo.toLowerCase() === `${user}.github.io`.toLowerCase() ? '' : `/${repo}`;
  return {
    GITHUB_USER: user, GITHUB_REPO: repo, REPOSITORY: `${user}/${repo}`,
    SITE_URL: origin, BASE_PATH: base, SITE_PUBLIC_URL: `${origin}${base}/`,
    GH_TOKEN: values.GH_TOKEN, GH_HOST: 'github.com', GH_PROMPT_DISABLED: '1',
    GIT_TERMINAL_PROMPT: '0',
    GIT_AUTHOR_NAME: values.GIT_AUTHOR_NAME, GIT_AUTHOR_EMAIL: values.GIT_AUTHOR_EMAIL,
    GIT_COMMITTER_NAME: values.GIT_AUTHOR_NAME, GIT_COMMITTER_EMAIL: values.GIT_AUTHOR_EMAIL,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const config = publicationConfig(parseEnv(readFileSync(new URL('../.env.publish', import.meta.url), 'utf8')));
    const [command = '--check', ...args] = process.argv.slice(2);
    const publicFields = ['GITHUB_USER', 'GITHUB_REPO', 'REPOSITORY', 'SITE_URL', 'BASE_PATH', 'SITE_PUBLIC_URL'];
    if (command === '--check') {
      console.log(`Configuração local válida: ${config.REPOSITORY}\nURL: ${config.SITE_PUBLIC_URL}\nToken: configurado (não exibido). Autenticação remota ainda não verificada.`);
    } else if (command === '--get') {
      if (!publicFields.includes(args[0])) throw new Error('Só é permitido consultar campos públicos de publicação.');
      console.log(config[args[0]]);
    } else {
      const env = { ...process.env, ...config };
      // Builds and dependency installation do not need a GitHub credential.
      if (['npm', 'npx'].includes(command)) {
        delete env.GH_TOKEN;
        delete env.GITHUB_TOKEN;
      }
      const result = spawnSync(command, args, { env, stdio: 'inherit', shell: false });
      if (result.error) throw new Error('Não foi possível iniciar o comando. Confira se a ferramenta está instalada e no PATH.');
      process.exitCode = result.status ?? 1;
    }
  } catch (error) {
    console.error(error.code === 'ENOENT' ? 'Crie .env.publish a partir de docs/publicacao.env.example.' : error.message);
    process.exitCode = 1;
  }
}
