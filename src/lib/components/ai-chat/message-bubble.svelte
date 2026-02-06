<script lang="ts">
	import { fly, fade } from "svelte/transition";
	import { marked } from "marked";

	let { message } = $props<{ message: any }>();

	const isUser = message.role === "user";
	let htmlContent = $state("");
	let rawContent = $state("");

	$effect(() => {
		let content = "";

		// 1. Try 'parts' (Vercel Core)
		if (Array.isArray(message.parts)) {
			content = message.parts
				.map((p: any) => {
					if (p.type === "text") return p.text;
					// Sometimes local optimistic parts are just strings or different objects
					if (typeof p === "string") return p;
					return "";
				})
				.join("");
		}
		// 2. Try 'content' (Legacy/Simple)
		else if (typeof message.content === "string") {
			content = message.content;
		}
		// 3. Try 'text' property (seen in some adapters)
		else if (typeof message.text === "string") {
			content = message.text;
		}

		rawContent = content;

		if (content) {
			// marked.parse can be sync or async depending on version/config
			Promise.resolve(marked.parse(content)).then((res) => {
				htmlContent = res;
			});
		} else {
			htmlContent = "";
		}
	});
</script>

<div
	class="flex w-full mb-8 {isUser ? 'justify-end' : 'justify-start'}"
	in:fly={{ y: 10, duration: 400 }}
	out:fade
>
	<div
		class="relative max-w-[85%] px-6 py-4 transition-all duration-300
    {isUser
			? 'bg-[#111111] text-white rounded-2xl rounded-tr-sm shadow-md'
			: 'bg-[#F3F3F3] text-[#111111] rounded-2xl rounded-tl-sm'}"
	>
		<div
			class="prose prose-sm {isUser
				? 'prose-invert'
				: ''} max-w-none leading-7 font-normal tracking-wide break-words"
		>
			{#if !rawContent && (message.status === "active" || message.role === "assistant")}
				<!-- Loading Indicator -->
				<span class="inline-flex gap-1 items-center h-6">
					<span
						class="w-1.5 h-1.5 bg-current opacity-40 rounded-full animate-bounce [animation-duration:1s]"
					></span>
					<span
						class="w-1.5 h-1.5 bg-current opacity-40 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.2s]"
					></span>
					<span
						class="w-1.5 h-1.5 bg-current opacity-40 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.4s]"
					></span>
				</span>
			{:else}
				{@html htmlContent}
			{/if}
		</div>
	</div>
</div>

<style>
	/* Minimalist Prose Overrides */
	:global(.prose p) {
		margin-bottom: 0.5em;
		margin-top: 0.5em;
	}
	:global(.prose > :first-child) {
		margin-top: 0;
	}
	:global(.prose > :last-child) {
		margin-bottom: 0;
	}
	:global(.prose pre) {
		background-color: rgba(0, 0, 0, 0.05); /* Light mode code block */
		color: #111;
		border-radius: 0.5rem;
		padding: 0.75rem;
		border: 1px solid rgba(0, 0, 0, 0.05);
		overflow-x: auto;
		white-space: pre;
	}
	:global(.prose-invert pre) {
		background-color: rgba(255, 255, 255, 0.1); /* Dark mode code block */
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}
	:global(.prose code) {
		color: inherit;
		font-weight: 500;
	}
</style>
