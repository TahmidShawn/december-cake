import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
const PrimaryButton = ({ children, className = "" }) => {
    return (
        <Button
            variant="asymmetric"
            size="lg"
            className={`gap-2 px-6 py-2 text-sm font-semibold ${className}`}
        >
            {children}
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-foreground text-primary transition-transform duration-300 group-hover/button:rotate-45">
                <ArrowUpRight className="size-3.5" />
            </span>
        </Button>
    );
};
export default PrimaryButton;
