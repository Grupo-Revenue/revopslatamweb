import { useDynamicStyles } from "@/hooks/useDynamicStyles";

/** Invisible component that loads dynamic styles from DB and applies CSS vars */
export default function DynamicStylesLoader() {
  useDynamicStyles();
  return null;
}
