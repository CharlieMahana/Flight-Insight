import { signIn, signOut } from "@auth/sveltekit/client"
import { page } from "$app/stores"
import { redirect } from "@sveltejs/kit";
import type { Actions,RequestEvent,Cookies } from "@sveltejs/kit"
import Credentials from "@auth/core/providers/credentials";
import { goto } from '$app/navigation';



/** @type {import('./$types').Actions} */
export const actions:Actions = {
    search: async (event:RequestEvent) =>{
        const data = await event.request.formData();
        const flightCode = data.get("search");
        throw redirect(307,"/dashboard?flightCode="+flightCode);
        return {message:flightCode,success:true}

    },
    login: async (event:RequestEvent)=>{
        const data = await event.request.formData();
        const user = data.get("aadvantage");
        const password = data.get("password");
        const resp = await signIn("credentials",{user, password});
        return {message:user,success:true};

        console.log(data);
    }
}