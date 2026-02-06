<script lang="ts">
	import { Chat } from "$lib/components/ai-chat";
</script>

<div
	class="min-h-screen flex flex-col items-center justify-start bg-[#FAFAFA] text-[#111] font-sans selection:bg-black/10 p-6 pt-20"
>
	<main class="text-center max-w-5xl space-y-8 w-full pb-20">
		<h1 class="text-4xl md:text-5xl font-bold tracking-tight text-black">
			Svelte AI Chat
		</h1>

		<p class="text-lg text-black/60 leading-relaxed">
			A minimalist, copy-paste ready chat widget for Svelte 5.
			<br />
			Powered by Vercel AI SDK.
		</p>

		<div class="flex justify-center gap-4">
			<a
				href="https://github.com/YusufCeng1z/svelte-ai-chat"
				target="_blank"
				class="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-black/80 transition-colors"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path
						d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
					></path></svg
				>
				GitHub Repo
			</a>
		</div>

		<div
			class="mt-16 flex flex-col gap-8 text-left w-full max-w-2xl mx-auto"
		>
			<div
				class="bg-white rounded-2xl border border-black/5 p-6 shadow-sm w-full"
			>
				<p
					class="text-xs font-semibold text-black/40 uppercase tracking-wider mb-4"
				>
					1. Install & Copy
				</p>
				<div class="font-mono text-xs space-y-2 text-black/80">
					<p>
						<span class="text-black/30 select-none">$</span> npm install
						ai @ai-sdk/svelte
					</p>
					<div class="h-px bg-black/5 my-2"></div>
					<p>
						<span class="text-black/30 select-none">></span> Copy folder:
					</p>
					<p
						class="bg-black/5 px-2 py-1.5 rounded text-black/60 break-all border border-black/5"
					>
						src/lib/components/ai-chat
					</p>
				</div>
			</div>

			<div
				class="bg-white rounded-2xl border border-black/5 p-6 shadow-sm w-full"
			>
				<p
					class="text-xs font-semibold text-black/40 uppercase tracking-wider mb-4"
				>
					2. Setup API
				</p>
				<div
					class="font-mono text-xs text-black/80 overflow-x-auto bg-[#FDFDFD] p-3 rounded-lg border border-black/5"
				>
					<pre
						class="whitespace-pre text-[10px] leading-relaxed">// src/routes/api/chat/+server.ts
import &#123; streamText &#125; from 'ai';
import &#123; createOpenAI &#125; from '@ai-sdk/openai';

export const POST = async (&#123; request &#125;) => &#123;
  const &#123; messages &#125; = await request.json();
  return streamText(&#123;
    model: createOpenAI(...)('model-name'),
    messages
  &#125;).toUIMessageStreamResponse();
&#125;;</pre>
				</div>
			</div>

			<div
				class="bg-white rounded-2xl border border-black/5 p-6 shadow-sm w-full"
			>
				<p
					class="text-xs font-semibold text-black/40 uppercase tracking-wider mb-4"
				>
					3. Use Component
				</p>
				<div
					class="font-mono text-xs text-black/80 overflow-x-auto bg-[#FDFDFD] p-3 rounded-lg border border-black/5"
				>
					<pre class="whitespace-pre">&lt;script&gt;
  import &#123; Chat &#125; from "$lib/components/ai-chat";
&lt;/script&gt;

&lt;Chat
  api="/api/chat"
  title="Assistant"
/&gt;</pre>
				</div>
			</div>
		</div>
	</main>

	<footer class="fixed bottom-6 left-6 text-xs text-black/20">
		MIT License
	</footer>

	<Chat
		title="Svelte Demo"
		systemPrompt="You are a helpful, minimalist AI assistant."
	/>
</div>

<style>
	:global(body) {
		background-color: #fafafa;
		margin: 0;
	}
</style>
