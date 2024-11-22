import { fd, get} from "$lib/utils";
import { decodePaymentRequest } from "@cashu/cashu-ts";

export async function load({ params }) {
	const req = { ...decodePaymentRequest(params.request) };
	const { target } = req.transport[0];
	const recipient = await get(`/profile/${target}`);
	return { req, recipient };
}

export const actions = {
	setAmount: async ({ request }) => {
		return await fd(request);
	},
};