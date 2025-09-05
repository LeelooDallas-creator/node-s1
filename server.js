import http from 'http';
import fs from 'fs';
import path from 'path';
import querystring from 'querystring';
import dotenv from 'dotenv';
import pug from 'pug';
dotenv.config();

import students from './data/students.js';
import { formatDate } from './utils/utils.js';

const HOST = process.env.APP_HOST || 'localhost';
const PORT = process.env.APP_PORT || 3000;

function serveStaticFile(res, filepath, contentType) {
    fs.readFile(filepath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}

const server = http.createServer((req, res) => {
    const urlParts = req.url.split('?')[0];

    // CSS
   if (urlParts.startsWith('/styles/')) {
    const filepath = path.join(process.cwd(), urlParts);
    return serveStaticFile(res, filepath, 'text/css');
}

    // Page accueil / formulaire
    if ((urlParts === '/' || urlParts.startsWith('/edit/')) && req.method === 'GET') {
        let student = null;
        let studentIndex = null;
        if (urlParts.startsWith('/edit/')) {
            const id = parseInt(urlParts.split('/')[2]);
            if (!isNaN(id) && students[id]) {
                student = students[id];
                studentIndex = id;
            }
        }
        const html = pug.renderFile(path.join(process.cwd(), 'view', 'home.pug'), { student, studentIndex });
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(html);
    }

    // Ajouter / modifier
    if (urlParts === '/add' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const parsed = querystring.parse(body);
            let message = '';
            if (parsed.id !== undefined) {
                const id = parseInt(parsed.id);
                students[id] = { name: parsed.name, birth: parsed.birth };
                message = 'Utilisateur modifié !';
            } else {
                students.push({ name: parsed.name, birth: parsed.birth });
                message = 'Utilisateur ajouté !';
            }
            const html = pug.renderFile(path.join(process.cwd(), 'view/home.pug'), { message });
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        });
        return;
    }

    // Supprimer un étudiant
    if (urlParts.startsWith('/delete/') && req.method === 'POST') {
        const id = parseInt(urlParts.split('/')[2]);
        if (!isNaN(id)) {
            students.splice(id, 1);
        }
        const html = pug.renderFile(path.join(process.cwd(), 'view/users.pug'), { students, message: 'Utilisateur supprimé !', formatDate });
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(html);
    }

    // Page utilisateurs
    if (urlParts === '/users' && req.method === 'GET') {
        const html = pug.renderFile(path.join(process.cwd(), 'view/users.pug'), { students, formatDate });
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(html);
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page non trouvée');
});

server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
});
