import z from 'zod';

const envVariables = z.object({
	VITE_VENDURE_PUBLIC_URL: z.string(),
});

console.log('import.meta.env', import.meta.env);
export const ENV_VARIABLES = envVariables.parse(import.meta.env);
