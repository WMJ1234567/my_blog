const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// serve uploaded files
app.use('/uploads', express.static(UPLOADS_DIR));

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, UPLOADS_DIR); },
  filename: function (req, file, cb) { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

function readJSON(filename){
  const p = path.join(DATA_DIR, filename);
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch(e){ return null; }
}
function writeJSON(filename, obj){
  const p = path.join(DATA_DIR, filename);
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf8');
}

// Serve static site (the same folder)
app.use(express.static(path.join(__dirname)));

// API: resume
app.get('/api/resume', (req, res) => {
  const data = readJSON('resume.json');
  if (!data) return res.status(404).json({ error: 'resume not found' });
  res.json(data);
});

// 上传简历（multipart/form-data，字段名: resume）
app.post('/api/upload-resume', upload.single('resume'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no file uploaded' });
  const resume = readJSON('resume.json') || {};
  resume.resumeFile = '/uploads/' + req.file.filename;
  writeJSON('resume.json', resume);
  res.status(201).json({ file: resume.resumeFile });
});

// 上传头像（multipart/form-data，字段名: avatar）
app.post('/api/upload-avatar', upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no file uploaded' });
  const resume = readJSON('resume.json') || {};
  resume.avatar = '/uploads/' + req.file.filename;
  writeJSON('resume.json', resume);
  res.status(201).json({ avatar: resume.avatar });
});

// 添加证书记录（JSON: { title, path }，path 应为 /uploads/xxx.png）
app.post('/api/add-certificate', (req, res) => {
  const body = req.body || {};
  if (!body.path) return res.status(400).json({ error: 'path required' });
  const resume = readJSON('resume.json') || {};
  if (!Array.isArray(resume.certificates)) resume.certificates = [];
  const cert = { id: Date.now(), title: body.title || '证书', path: body.path };
  resume.certificates.push(cert);
  writeJSON('resume.json', resume);
  res.status(201).json(cert);
});

// 上传证书图片并直接添加记录（multipart/form-data，字段名: certificate， 可选字段: title）
app.post('/api/upload-certificate', upload.single('certificate'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no file uploaded' });
  const title = req.body.title || '证书';
  const resume = readJSON('resume.json') || {};
  if (!Array.isArray(resume.certificates)) resume.certificates = [];
  const cert = { id: Date.now(), title: title, path: '/uploads/' + req.file.filename };
  resume.certificates.push(cert);
  writeJSON('resume.json', resume);
  res.status(201).json(cert);
});

// 更新证书元数据（如标题）
app.put('/api/certificates/:id', (req, res) => {
  const id = Number(req.params.id);
  const body = req.body || {};
  const resume = readJSON('resume.json') || {};
  if (!Array.isArray(resume.certificates)) resume.certificates = [];
  const idx = resume.certificates.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'certificate not found' });
  if (body.title !== undefined) resume.certificates[idx].title = body.title;
  if (body.path !== undefined) resume.certificates[idx].path = body.path;
  writeJSON('resume.json', resume);
  res.json(resume.certificates[idx]);
});

// 删除证书记录并尝试删除上传的文件
app.delete('/api/certificates/:id', (req, res) => {
  const id = Number(req.params.id);
  const resume = readJSON('resume.json') || {};
  if (!Array.isArray(resume.certificates)) resume.certificates = [];
  const idx = resume.certificates.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'certificate not found' });
  const cert = resume.certificates.splice(idx,1)[0];
  writeJSON('resume.json', resume);
  // 尝试删除文件
  try{
    if (cert.path && cert.path.startsWith('/uploads/')){
      const filePath = path.join(UPLOADS_DIR, path.basename(cert.path));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  }catch(e){ console.warn('failed to delete file', e); }
  res.json({ deleted: true });
});

// API: bookmarks
app.get('/api/bookmarks', (req, res) => {
  const data = readJSON('bookmarks.json') || [];
  res.json(data);
});

app.post('/api/bookmarks', (req, res) => {
  const list = readJSON('bookmarks.json') || [];
  const item = req.body || {};
  item.id = Date.now();
  list.push(item);
  writeJSON('bookmarks.json', list);
  res.status(201).json(item);
});

app.delete('/api/bookmarks/:id', (req, res) => {
  const id = Number(req.params.id);
  let list = readJSON('bookmarks.json') || [];
  const before = list.length;
  list = list.filter(x => x.id !== id);
  writeJSON('bookmarks.json', list);
  res.json({ deleted: before - list.length });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
