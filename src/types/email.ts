import { z } from "zod";

export const AddressBlob = z.object({
	address: z.string(),
	name: z.string().nullable(),
});

export const EmailJson = z.object({
	body: z.string().nullable(),
	body_html: z.string().nullable(),
	date: z.string().nullable(),
	from: z.array(AddressBlob),
	subject: z.string().nullable(),
	to: z.array(AddressBlob),
});

export const EmailMetadata = z.object({
	date: z.string().nullable(),
	from_address: z.string(),
	from_name: z.string().nullable(),
	id: z.string(),
	subject: z.string().nullable(),
});
export type EmailMetadata = z.infer<typeof EmailMetadata>;

export const EmailRow = z.object({
	body: z.string().nullable(),
	date: z.string().nullable(),
	from_address: z.string(),
	from_name: z.string().nullable(),
	html: z.string().nullable(),
	id: z.string(),
	subject: z.string().nullable(),
	to_address: z.string().nullable(),
	to_name: z.string().nullable(),
});
export type EmailRow = z.infer<typeof EmailRow>;
