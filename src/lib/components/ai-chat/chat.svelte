<script lang="ts">
	import { Chat } from "@ai-sdk/svelte";
	import ChatInput from "./chat-input.svelte";
	import MessageBubble from "./message-bubble.svelte";
	import { fly, fade, scale } from "svelte/transition";
	import { tick } from "svelte";
	import { browser } from "$app/environment";

	let {
		api = "/api/chat",
		systemPrompt = "You are a helpful AI assistant.",
		initialMessages = [],
		title = "AI Assistant",
	} = $props<{
		api?: string;
		systemPrompt?: string;
		initialMessages?: any[];
		title?: string;
	}>();

	let isOpen = $state(false);
	let scrollContainer: HTMLDivElement | undefined = $state(undefined);

	const chat = new Chat({
		api: api,
		initialMessages,
		onFinish: () => {
			scrollToBottom();
			saveToLocalStorage();
		},
		onError: (error) => {
			console.error("Chat Error:", error);
			alert("Chat Error: " + error.message);
		},
	});

	$effect(() => {
		if (browser && chat.messages.length === 0) {
			const saved = localStorage.getItem("chat_widget_history");
			if (saved) {
				try {
					chat.messages = JSON.parse(saved);
				} catch (e) {
					console.error(e);
				}
			}
		}
	});

	function saveToLocalStorage() {
		if (browser) {
			localStorage.setItem(
				"chat_widget_history",
				JSON.stringify(chat.messages),
			);
		}
	}

	function scrollToBottom() {
		if (scrollContainer) {
			tick().then(() => {
				if (scrollContainer)
					scrollContainer.scrollTop = scrollContainer.scrollHeight;
			});
		}
	}

	$effect(() => {
		if (chat.messages.length && scrollContainer) {
			scrollToBottom();
		}
	});

	function toggleOpen() {
		isOpen = !isOpen;
		if (isOpen) {
			if (browser && window.innerWidth < 640) {
				document.body.style.overflow = "hidden";
			}
			scrollToBottom();
		} else {
			if (browser) document.body.style.overflow = "";
		}
	}

	async function handleQuickAction(text: string) {
		await chat.sendMessage({ text });
	}

	function handleClear() {
		if (confirm("Are you sure you want to clear the chat history?")) {
			chat.messages = [];
			if (browser) localStorage.removeItem("chat_widget_history");
		}
	}

	async function handleSend(text: string) {
		try {
			await chat.sendMessage({ text });
		} catch (error) {
			console.error("SendMessage Error:", error);
		}
	}

	let isLoading = $derived(
		chat.status === "streaming" || chat.status === "submitted",
	);
</script>

<div
	class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans text-[#111]"
>
	{#if isOpen}
		<div
			class="w-full h-full sm:w-[380px] sm:h-[600px] sm:max-h-[80vh] bg-white sm:rounded-[24px] shadow-2xl shadow-black/10 border-0 sm:border border-black/5 flex flex-col overflow-hidden origin-bottom-right fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[60]"
			transition:scale={{ duration: 300, start: 0.9, opacity: 0 }}
		>
			<div
				class="h-14 border-b border-black/[0.04] flex items-center justify-between px-5 bg-white/95 backdrop-blur-sm z-10 shrink-0"
			>
				<div class="flex items-center gap-3">
					<div
						class="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
					></div>
					<span
						class="text-[10px] font-bold tracking-widest uppercase opacity-40"
						>{title}</span
					>
				</div>

				<div class="flex items-center gap-1">
					<button
						onclick={handleClear}
						class="p-2 text-black/30 hover:text-red-500 transition-colors"
						title="Clear Chat"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><polyline points="3 6 5 6 21 6"></polyline><path
								d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
							></path></svg
						>
					</button>
					<button
						onclick={toggleOpen}
						class="p-2 text-black/30 hover:text-black transition-colors"
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
							><line x1="18" y1="6" x2="6" y2="18"></line><line
								x1="6"
								y1="6"
								x2="18"
								y2="18"
							></line></svg
						>
					</button>
				</div>
			</div>

			<div
				bind:this={scrollContainer}
				class="flex-1 overflow-y-auto p-5 scroll-smooth bg-[#FAFAFA] relative"
			>
				{#if chat.messages.length === 0}
					<div
						class="h-full flex flex-col items-center justify-center text-center select-none pb-10"
						in:fade
					>
						<div
							class="w-16 h-16 rounded-2xl bg-white shadow-sm border border-black/5 flex items-center justify-center mb-6"
						>
							<span class="text-2xl">✨</span>
						</div>
						<h3 class="text-lg font-semibold text-[#111] mb-2">
							How can I help?
						</h3>
						<p class="text-sm text-black/40 max-w-[200px]">
							Ask me any question or request code assistance.
						</p>

						<div
							class="mt-8 flex flex-col gap-2 w-full max-w-[240px]"
						>
							<button
								onclick={() =>
									handleQuickAction(
										"Summarize the latest tech news",
									)}
								class="text-xs text-left px-4 py-2.5 bg-white border border-black/5 rounded-xl hover:border-black/10 hover:shadow-sm transition-all text-black/60 hover:text-black truncate"
							>
								Summarize the latest tech news
							</button>
							<button
								onclick={() =>
									handleQuickAction(
										"Write a Python script for...",
									)}
								class="text-xs text-left px-4 py-2.5 bg-white border border-black/5 rounded-xl hover:border-black/10 hover:shadow-sm transition-all text-black/60 hover:text-black truncate"
							>
								Write a Python script for...
							</button>
						</div>
					</div>
				{/if}

				{#each chat.messages as message (message.id)}
					<MessageBubble {message} />
				{/each}

				{#if isLoading}
					{#if chat.messages[chat.messages.length - 1]?.role === "user"}
						<div
							class="flex w-full mb-8 justify-start"
							in:fly={{ y: 10, duration: 400 }}
						>
							<div
								class="bg-[#F3F3F3] text-[#111111] rounded-2xl rounded-tl-sm px-6 py-4"
							>
								<span
									class="inline-flex gap-1 items-center h-6"
								>
									<span
										class="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce [animation-duration:1s]"
									></span>
									<span
										class="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.2s]"
									></span>
									<span
										class="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.4s]"
									></span>
								</span>
							</div>
						</div>
					{/if}
				{/if}
			</div>

			<div class="p-4 bg-white border-t border-black/[0.04] shrink-0">
				<ChatInput onSend={(text) => handleSend(text)} />
			</div>
		</div>
	{/if}

	<button
		onclick={toggleOpen}
		class="w-[60px] h-[60px] bg-[#111111] text-white rounded-full shadow-lg shadow-black/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 group z-50"
	>
		{#if isOpen}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="transition-transform duration-300 rotate-90"
				><polyline points="6 9 12 15 18 9"></polyline></svg
			>
		{:else}
			<div class="relative">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="group-hover:-translate-y-1 transition-transform duration-300"
					><path
						d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
					></path></svg
				>
				{#if chat.messages.length > 0}
					<span
						class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#111]"
					></span>
				{/if}
			</div>
		{/if}
	</button>
</div>

<style>
	::-webkit-scrollbar {
		width: 4px;
	}
	::-webkit-scrollbar-track {
		background: transparent;
	}
	::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.05);
		border-radius: 10px;
	}
	::-webkit-scrollbar-thumb:hover {
		background: rgba(0, 0, 0, 0.15);
	}
</style>
