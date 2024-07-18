const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.use(
        '/_next/static',
        createProxyMiddleware({
            target: 'http://localhost:3000',
            changeOrigin: true,
            pathRewrite: {
                '^/_next/static': '/_next/static',
            },
            onProxyRes: (proxyRes) => {
                proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            },
        })
    );

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
    });
});
