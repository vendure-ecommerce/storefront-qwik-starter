import { $, component$, useSignal } from '@qwik.dev/core';
import { Action } from '@qwik.dev/router';
import { LuTrash } from '@qwikest/icons/lucide';

interface FormImageInputProps<T extends Action<any, any, any>> {
	name: string;
	label: string;
	formAction: ReturnType<T>;
	maxFiles?: number;
	className?: string;
}

export default component$<FormImageInputProps<Action<any, any, any>>>(
	({ name, label, formAction, maxFiles = 2, className }) => {
		const fieldErrors = formAction.value?.fieldErrors as
			| Record<string, string | undefined>
			| undefined;
		const error = fieldErrors?.[name as string];

		const imageFiles = useSignal<File[]>([]);
		const warning = useSignal<string>('');

		const handleFileChange = $(async (event: Event) => {
			const input = event.target as HTMLInputElement;
			if (input.files) {
				const filesArray = Array.from(input.files);
				if (filesArray.length > maxFiles) {
					warning.value = `You can only upload up to ${maxFiles} images.`;
				} else {
					warning.value = '';
				}
				imageFiles.value = filesArray.slice(0, maxFiles);
			}
		});

		const handleDelete = $((idx: number) => {
			imageFiles.value = imageFiles.value.filter((_, i) => i !== idx);
			warning.value = '';
		});

		return (
			<div class={className}>
				<label for={name} class="block text-sm font-medium text-gray-700">
					{label}
				</label>
				<input
					type="file"
					id={name}
					name={name}
					accept="image/*"
					multiple={maxFiles > 1}
					onChange$={handleFileChange}
					class="mt-1 block border rounded-md p-2 w-full text-sm text-gray-500"
					disabled={imageFiles.value.length >= maxFiles}
				/>
				{warning.value && <p class="text-xs text-red-600 mt-1">{warning.value}</p>}
				{imageFiles.value.length > 0 && (
					<div class="mt-2 flex space-x-2">
						{imageFiles.value.map((file, idx) => (
							<div key={idx} class="flex flex-col items-center">
								<div class="relative w-16 h-16">
									{typeof window !== 'undefined' && (
										<img
											src={URL.createObjectURL(file)}
											alt={file.name}
											class="w-16 h-16 object-cover rounded border"
										/>
									)}
									<button
										type="button"
										class="absolute top-0 right-0 m-1 text-xs text-red-500 hover:underline bg-white bg-opacity-80 rounded-full p-1"
										onClick$={() => handleDelete(idx)}
										style={{ zIndex: 10 }}
									>
										<LuTrash class="inline w-4 h-4" />
									</button>
								</div>
								<span class="text-xs text-gray-600 mt-1">{file.name}</span>
							</div>
						))}
					</div>
				)}
				{error && <p class="error text-xs text-red-600 mt-1">{error}</p>}
			</div>
		);
	}
);
