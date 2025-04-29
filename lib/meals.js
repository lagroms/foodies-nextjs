import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";
import fs from "fs";

const db = sql("meals.db");

export async function getMeals() {
	await new Promise((resolve) => setTimeout(resolve, 2000));
	return db.prepare("SELECT * FROM meals").all();
}

export async function getMeal(slug) {
	return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
}

export async function saveMeal(meal) {
	meal.slug = slugify(meal.title, { lower: true });
	meal.instructions = xss(meal.instructions);
	const extension = meal.image.name.split(".").pop();
	const fileName = `${meal.slug}.${extension}`;

	const stream = fs.createWriteStream(`public/images/${fileName}`);
	const bufferedImage = await meal.image.arrayBuffer();

	stream.write(Buffer.from(bufferedImage), (err) => {
		if (err) {
			throw new Error("Saving image failed");
		}
	});

	meal.image = `/images/${fileName}`;

	return db
		.prepare(
			"INSERT INTO meals (creator, creator_email, title, summary, instructions, image, slug) VALUES (@creator, @creator_email, @title, @summary, @instructions, @image, @slug)"
		)
		.run(meal);
}
