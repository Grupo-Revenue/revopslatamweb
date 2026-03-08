import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface ChipLinkProps {
  to: string;
  children: React.ReactNode;
}

const ChipLink = ({ to, children }: ChipLinkProps) => (
  <Link
    to={to}
    className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-md"
    style={{
      background: "linear-gradient(135deg, rgba(190,24,105,0.08), rgba(98,36,190,0.08))",
      color: "#BE1869",
    }}
  >
    {children} <ArrowRight size={12} />
  </Link>
);

export default ChipLink;
