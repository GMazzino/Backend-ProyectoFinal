import os from 'os';

export async function getInfo(req, res) {
  const info = {
    platform: `${os.type()} - ${os.release()} (${process.platform})`,
    nodeVersion: process.version,
    rss: process.memoryUsage().rss,
    pid: process.pid,
    cwd: process.cwd(),
    execPath: process.execPath,
    cpus: os.cpus().length,
  };
  await res.status(200).render('info.ejs', {
    info: info,
    redirect: '/',
  });
}
