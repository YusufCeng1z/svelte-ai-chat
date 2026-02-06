<script lang="ts">
	let { onSend } = $props<{ onSend: (text: string) => void }>();
	let value = $state("");

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (value.trim()) {
			onSend(value);
			value = "";
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e as any);
		}
	}
</script>

<form onsubmit={handleSubmit} class="relative w-full">
	<div class="relative group">
		<div
			class="relative flex items-end transition-all duration-300 gap-2 bg-[#FAFAFA] border border-black/5 rounded-[20px] px-2 py-2 focus-within:bg-white focus-within:border-black/10 focus-within:shadow-[0_2px_15px_-5px_rgba(0,0,0,0.05)] focus-within:ring-1 focus-within:ring-black/5"
		>
			<textarea
				bind:value
				onkeydown={handleKeydown}
				oninput={(e) => {
					const target = e.target as HTMLTextAreaElement;
					target.style.height = "auto";
					target.style.height =
						Math.min(target.scrollHeight, 120) + "px";
				}}
				placeholder="Type a message..."
				rows="1"
				class="flex-1 bg-transparent text-[#111111] px-2 py-3
               placeholder-black/30 font-medium text-[0.95rem] outline-none resize-none min-h-[44px] max-h-[120px]"
			/>

			<button
				type="submit"
				disabled={!value.trim()}
				class="p-2.5 rounded-full bg-black text-white hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-0 disabled:scale-75 disabled:cursor-not-allowed mb-[1px]"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="feather feather-arrow-up"
					><line x1="12" y1="19" x2="12" y2="5"></line><polyline
						points="5 12 12 5 19 12"
					></polyline></svg
				>
			</button>
		</div>
	</div>
</form>
