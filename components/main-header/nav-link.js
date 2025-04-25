"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import classes from "./nav-link.module.css";
import clsx from "clsx";

export default function NavLink({ href, children }) {
	const path = usePathname();

	return (
		<Link
			href={href}
			className={clsx(classes.link, {
				[classes.active]: path.startsWith(href),
			})}
		>
			{children}
		</Link>
	);
}
