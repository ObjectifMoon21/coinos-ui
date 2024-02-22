import { error, fail, redirect } from "@sveltejs/kit";
import { fd, auth, get, post } from "$lib/utils";

export async function load({ params: { id }, parent, url }) {
  let { rates, user } = await parent();

  let invoice = await get(`/invoice/${id}`);

  console.log("OH", invoice, invoice.prompt, invoice.tip);

  if (invoice.prompt && invoice.tip === null)
    redirect(307, `/${invoice.user.username}/invoice/${id}/tip`);
  if (invoice.user.username === user.username)
    error(500, { message: "Cannot send to self" });

  return { invoice, rates, user };
}

export const actions = {
  default: async ({ cookies, params: { id }, request }) => {
    try {
      let body = await fd(request);
      body.hash = id;

      await post("/payments", body, auth(cookies));
    } catch (e) {
      console.log("payment failed", params, e);
      return fail(400, { message: e.message });
    }

    redirect(307, "/sent");
  },
};
