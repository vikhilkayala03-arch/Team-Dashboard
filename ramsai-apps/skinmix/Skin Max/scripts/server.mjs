import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const port=Number(process.env.PORT)||5173;
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.json':'application/json'};
const server=http.createServer(async(req,res)=>{
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);return res.end('Bad URL');}
  const relative=pathname==='/'?'index.html':pathname.slice(1);
  if(!['index.html','styles.css'].includes(relative)&&!relative.startsWith('src/')&&!relative.startsWith('assets/')){res.writeHead(404);return res.end('Not found');}
  const target=path.resolve(root,relative);
  if(!target.startsWith(root+path.sep)){res.writeHead(403);return res.end('Forbidden');}
  try{if(!(await stat(target)).isFile())throw new Error();const body=await readFile(target);res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin'});res.end(body);}catch{res.writeHead(404);res.end('Not found');}
});
server.listen(port,'127.0.0.1',()=>console.log(`SkinMix is ready at http://127.0.0.1:${port}`));
server.on('error',error=>{console.error(error.message);process.exit(1);});
