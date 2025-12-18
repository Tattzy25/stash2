import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { imageHelpers } from "@/lib/image-helpers";
import type { ProviderTiming } from "@/lib/image-types";
import {
	FireworksIcon,
	OpenAIIcon,
	ReplicateIcon,
	VertexIcon,
} from "@/lib/logos";
import type { ProviderKey } from "@/lib/provider-config";
import { cn } from "@/lib/utils";

import { ImageDisplay } from "./ImageDisplay";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

interface ModelSelectProps {
	label: string;
	models: string[];
	value: string;
	providerKey: ProviderKey;
	onChange: (value: string, providerKey: ProviderKey) => void;
	iconPath: string;
	color: string;
	enabled?: boolean;
	onToggle?: (enabled: boolean) => void;
	image: string | null | undefined;
	timing?: ProviderTiming;
	failed?: boolean;
	modelId: string;
}

const PROVIDER_ICONS = {
	openai: OpenAIIcon,
	replicate: ReplicateIcon,
	vertex: VertexIcon,
	fireworks: FireworksIcon,
} as const;

const PROVIDER_LINKS = {
	openai: "openai",
	replicate: "replicate",
	vertex: "google-vertex",
	fireworks: "fireworks",
} as const;

export function ModelSelect({
	label,
	models,
	value,
	providerKey,
	onChange,
	enabled = true,
	image,
	timing,
	failed,
	modelId,
}: ModelSelectProps) {
	const Icon = PROVIDER_ICONS[providerKey];

	return (
		<Card
			className={cn("w-full transition-opacity", enabled ? "" : "opacity-50")}
		>
			<CardContent className="h-full pt-6">
				{/* Header hidden from UI but code intact */}
				<div className="hidden">
					<div className="flex w-full items-center gap-2 transition-opacity duration-200">
						<div className="rounded-full bg-primary p-2">
							<Link
								className="hover:opacity-80"
								href={
									"https://sdk.vercel.ai/providers/ai-sdk-providers/" +
									PROVIDER_LINKS[providerKey]
								}
								target="_blank"
							>
								<div className="text-primary-foreground">
									<Icon size={28} />
								</div>
							</Link>
						</div>
						<div className="flex w-full flex-col">
							<Link
								className="hover:opacity-80"
								href={
									"https://sdk.vercel.ai/providers/ai-sdk-providers/" +
									PROVIDER_LINKS[providerKey]
								}
								target="_blank"
							>
								<h3 className="font-semibold text-lg">{label}</h3>
							</Link>
							<div className="flex w-full items-center justify-between">
								<Select
									defaultValue={value}
									onValueChange={(selectedValue) =>
										onChange(selectedValue, providerKey)
									}
									value={value}
								>
									<SelectTrigger>
										<SelectValue placeholder={value || "Select a model"} />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{models.map((model) => (
												<SelectItem className="" key={model} value={model}>
													<span className="hidden xl:inline">
														{imageHelpers.formatModelId(model).length > 30
															? imageHelpers.formatModelId(model).slice(0, 30) +
																"..."
															: imageHelpers.formatModelId(model)}
													</span>
													<span className="hidden lg:inline xl:hidden">
														{imageHelpers.formatModelId(model).length > 20
															? imageHelpers.formatModelId(model).slice(0, 20) +
																"..."
															: imageHelpers.formatModelId(model)}
													</span>

													<span className="lg:hidden">
														{imageHelpers.formatModelId(model)}
													</span>
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
				</div>

				<ImageDisplay
					failed={failed}
					image={image}
					modelId={modelId}
					provider={providerKey}
					timing={timing}
				/>
			</CardContent>
		</Card>
	);
}
