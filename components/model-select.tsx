import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface SelectOption {
	value: string;
	label: string;
}

interface ModelSelectProps {
	value: string;
	onValueChange: (value: string) => void;
	options: SelectOption[];
	label?: string;
	placeholder?: string;
	className?: string;
}

export function ModelSelect({
	value,
	onValueChange,
	options,
	label = "Model",
	placeholder = "Select a model...",
	className = "",
}: ModelSelectProps) {
	return (
		<div className={`space-y-2 ${className}`}>
			<Label htmlFor="model" className="font-medium">
				{label}
			</Label>
			<Select value={value} onValueChange={onValueChange}>
				<SelectTrigger id="model">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
