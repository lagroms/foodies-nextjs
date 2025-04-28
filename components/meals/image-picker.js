"use client";
import classes from "./image-picker.module.css";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

export default function ImagePicker({ label, name }) {
	const imageInputRef = useRef();
	const [image, setImage] = useState();

	// Cleanup object URLs when component unmounts or when image changes
	useEffect(() => {
		return () => {
			if (image && image.startsWith("blob:")) {
				URL.revokeObjectURL(image);
			}
		};
	}, [image]);

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (!file) {
			return;
		}

		// Create a URL for the file
		const imageUrl = URL.createObjectURL(file);
		setImage(imageUrl);
	};

	return (
		<div className={classes.picker}>
			<label htmlFor={name}>{label}</label>
			<div className={classes.controls}>
				<div className={classes.preview}>
					{!image && <p>No image picked yet.</p>}
					{image && <Image src={image} alt="Preview" fill />}
				</div>
				<input
					ref={imageInputRef}
					className={classes.input}
					type="file"
					id={name}
					name={name}
					accept="image/png, image/jpeg"
					onChange={handleImageChange}
					required
				/>
				<button
					className={classes.button}
					type="button"
					onClick={() => {
						imageInputRef.current.click();
					}}
				>
					Pick Image
				</button>
			</div>
		</div>
	);
}
