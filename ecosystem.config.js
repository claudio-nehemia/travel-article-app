module.exports = {
  apps: [
    {
      name: 'travel-article-app',
      script: 'npm',
      args: 'start',
      cwd: '/home/deployuser/apps/travel-article-app',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      max_memory_restart: '1G',
      restart_delay: 4000,
      min_uptime: '10s',
      max_restarts: 10,
      autorestart: true,
      watch: false,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],

  deploy: {
    production: {
      user: 'deployuser',
      host: '31.97.221.115',
      ref: 'origin/main',
      repo: 'https://github.com/claudio-nehemia/travel-article-app.git',
      path: '/home/deployuser/apps/travel-article-app',
      'post-deploy':
        'npm install --legacy-peer-deps && npm run build && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production',
      },
    },
  },
};
