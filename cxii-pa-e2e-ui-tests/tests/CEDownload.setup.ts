import { test, expect, request } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import * as tar from 'tar';

// Only load .env for local development
if (process.env.NODE_ENV !== 'ci') {
  require('dotenv').config();
}

let branch = null;
if (process.env.ENV == 'dev') {
  branch = 'master';
} else if (process.env.ENV == 'canary') {
  branch = 'canary';
} else if (process.env.ENV == 'prod') {
  branch = 'master';
}

test.skip('Download and extract artifact from another Jenkins pipeline', async () => {
  console.log('🔧 Setting up download directory...');
  const downloadDir = 'tests/downloads';
  if (fs.existsSync(downloadDir)) {
    fs.rmSync(downloadDir, { recursive: true, force: true });
    console.log(`🗑️ Download directory deleted at: ${downloadDir}`);
  }
  fs.mkdirSync(downloadDir, { recursive: true });
  console.log(`📁 Download directory created at: ${downloadDir}`);

  // 🔐 Prefer Jenkins credentials over local .env
  const username = process.env.JENKINS_USERNAME || process.env.DEFAULT_USERNAME;
  const token = process.env.JENKINS_PASSWORD || process.env.DEFAULT_PASSWORD;

  console.log(`🔑 Jenkins Username Set: ${!!username}, Token Set: ${!!token}`);
  if (!username || !token) {
    throw new Error('❌ Missing Jenkins credentials. Ensure environment variables are set.');
  }

  const artifactPath = `/job/CX%20AIML/job/cxii-pa-browser-extension/job/${branch}/lastSuccessfulBuild/api/json`;

  console.log(`${artifactPath}`)
  const requestContext = await request.newContext({
    baseURL: 'https://jenkins.cxai.dev.sap',
    extraHTTPHeaders: {
      Authorization: 'Basic ' + Buffer.from(`${username}:${token}`).toString('base64'),
    },
  });

  const response = await requestContext.get(artifactPath);
  console.log(`📥 Response status: ${response.status()}`);
  expect(response.ok()).toBeTruthy();

  const data = await response.json();
  const artifact = data.artifacts.find((a: any) => a.fileName.startsWith('cxii-pa-browser-extension') && a.fileName.endsWith('.tar.gz'));

  if (!artifact) throw new Error('❌ No TAR artifact found in the Jenkins build.');
  console.log(`📦 Found artifact: ${artifact.fileName}`);

  const artifactUrl = `https://jenkins.cxai.dev.sap/job/CX%20AIML/job/cxii-pa-browser-extension/job/${branch}/lastSuccessfulBuild/artifact/${artifact.relativePath}`;
  const res = await axios.get(artifactUrl, {
    responseType: 'stream',
    auth: { username, password: token },
  });

  await new Promise((resolve, reject) => {
    const extract = tar.x({ cwd: downloadDir });
    res.data.pipe(extract);
    extract.on('finish', () => {
      console.log('✅ Artifact extraction completed');
      resolve(null);
    });
    extract.on('error', (err) => {
      console.error('❌ Extraction failed:', err);
      reject(err);
    });
  });

  const files = fs.readdirSync(downloadDir);
  console.log(`📂 Files extracted: ${files.join(', ')}`);
  expect(files.length).toBeGreaterThan(0);
});
