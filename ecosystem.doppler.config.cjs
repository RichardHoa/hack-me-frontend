module.exports = {
	apps: [
		{
			name: 'hack-me-frontend',
			cwd: '/home/richardhoa_work/codes/hack-me-frontend',
			script: 'doppler',
			args: "run -- bash -lc 'make run'",
			instances: 1,
			exec_mode: 'fork',
			autorestart: true,
			out_file: '/home/richardhoa_work/codes/hack-me-frontend/out.log',
			error_file: '/home/richardhoa_work/codes/hack-me-frontend/err.log',
			merge_logs: true
		}
	]
};
