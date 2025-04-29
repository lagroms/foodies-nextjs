"use server";
import { revalidatePath } from "next/cache";
import { saveMeal } from "./meals";
import { redirect } from "next/navigation";

const isInvalidText = (text) => {
	return text.trim() === "" || !text;
};

export const shareMeal = async (prevState, formData) => {
	const meal = {
		creator: formData.get("name"),
		creator_email: formData.get("email"),
		title: formData.get("title"),
		summary: formData.get("summary"),
		instructions: formData.get("instructions"),
		image: formData.get("image"),
	};

	if (isInvalidText(meal.title)) {
		return { error: "Title is required" };
	}

	if (isInvalidText(meal.summary)) {
		return { error: "Summary is required" };
	}

	if (isInvalidText(meal.instructions)) {
		return { error: "Instructions are required" };
	}

	if (isInvalidText(meal.creator)) {
		return { error: "Creator is required" };
	}

	if (
		isInvalidText(meal.creator_email) &&
		!meal.creator_email.includes("@")
	) {
		return { error: "Invalid email address" };
	}

	if (!meal.image || meal.image.size === 0) {
		return { error: "Image is required" };
	}

	await saveMeal(meal);
	revalidatePath("/meals");
	redirect("/meals");
};
