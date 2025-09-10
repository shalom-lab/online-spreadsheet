

/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const repositoryName = 'online-spreadsheet'; // change if repo name differs

const basePath = isGithubActions ? `/${repositoryName}` : '';

export default {
	output: 'export',
	basePath,
	assetPrefix: basePath ? `${basePath}/` : '',
	images: { unoptimized: true },
	trailingSlash: true,
};
