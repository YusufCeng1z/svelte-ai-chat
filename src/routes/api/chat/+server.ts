import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

export const config = {
	maxDuration: 30
};

const groq = createGroq({
	apiKey: env.GROQ_API_KEY ?? '',
});

function convertToCoreMessages(messages: any[]) {
	const validRoles = ['system', 'user', 'assistant', 'tool'];

	return messages
		.map((m: any) => {
			let content = '';

			if (typeof m.content === 'string') {
				content = m.content;
			} else if (Array.isArray(m.content)) {
				content = m.content
					.map((part: any) => {
						if (typeof part === 'string') return part;
						if (part.type === 'text') return part.text;
						return '';
					})
					.join('\n');
			} else if (Array.isArray(m.parts)) {
				content = m.parts
					.map((p: any) => (p.type === 'text' ? p.text : ''))
					.join('\n');
			}

			return {
				role: m.role,
				content: content || '',
			};
		})
		.filter(m => validRoles.includes(m.role) && m.content.trim().length > 0) as any[];
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { messages } = await request.json();

		const result = streamText({
			model: groq('llama-3.1-8b-instant'),
			messages: convertToCoreMessages(messages),
		});

		return result.toUIMessageStreamResponse();
	} catch (error) {
		console.error('SERVER ERROR:', error);
		return new Response(JSON.stringify({ error: 'Internal Server Error', details: error }), { status: 500 });
	}
};
