export interface Message {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	status: 'sending' | 'done' | 'active' | 'error';
}

export type SendHandler = (content: string) => void;
